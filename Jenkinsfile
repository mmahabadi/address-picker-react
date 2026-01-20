// ============================================================================
// Jenkins Pipeline (Local Jenkins + GitHub friendly)
// ============================================================================
// Recommended Jenkins job:
// - New Item → Pipeline
// - Definition: Pipeline script from SCM
// - SCM: Git (your GitHub repo)
// - Branch: */main
// - Script Path: Jenkinsfile
//
// Key goals:
// - No hard-coded repository URL (uses `checkout scm` by default)
// - No mandatory Jenkins tool names (NodeJS-20 / Maven-3.9)
// - Optional Docker build/push via parameters
//
// JENKINS CONCEPTS:
// - Pipeline: Automated process that builds, tests, and deploys code
// - Stages: Logical divisions of the pipeline (build, test, deploy)
// - Steps: Individual commands within a stage
// - Agents: Machines that execute the pipeline (can be any, docker, etc.)
//
// DECLARATIVE vs SCRIPTED:
// - Declarative: Simpler, more structured (this file uses declarative)
// - Scripted: More flexible, uses Groovy scripting
//
// PIPELINE FLOW:
// 1. Checkout code from Git
// 2. Build frontend and backend
// 3. Run tests
// 4. Build Docker images
// 5. Push to registry (optional)
// ============================================================================
pipeline {
    // Agent: Where the pipeline runs
    // 'any' means use any available agent
    agent any

  // Options: Configuration for the pipeline
  options {
    // Add timestamps to the build logs
    timestamps()
    // Set a timeout of 30 minutes
    timeout(time: 30, unit: 'MINUTES')
    // Keep the last 10 builds
    buildDiscarder(logRotator(numToKeepStr: '10'))
    // We do our own checkout stage
    skipDefaultCheckout(true)
  }

  environment {
    // Ensure Jenkins (service user) can find Homebrew-installed tools
    EXTRA_PATH = '/opt/homebrew/opt/node@22/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/Docker.app/Contents/Resources/bin'

    // Force Maven to use JDK 17 (avoids Lombok/javac issues on newer Java)
    JDK17_HOME = '/opt/homebrew/opt/openjdk@17'

    // Filled after checkout
    GIT_COMMIT_SHORT = ''

    HUSKY = '0'
  }

  stages {
    stage('Checkout') {
        // Checkout the code from the repository
        steps {
            withEnv(["PATH=${EXTRA_PATH}:${env.PATH ?: ''}"]) {
            // Checkout the code from the repository
            checkout scm
            // Get the short commit hash and check for [skip ci]
            script {
                env.GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                echo "Commit: ${env.GIT_COMMIT_SHORT}"
                
                // Check if commit message contains [skip ci]
                def commitMsg = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                if (commitMsg.contains('[skip ci]') || commitMsg.contains('[ci skip]')) {
                    echo "⏭️ Skipping build - commit message contains [skip ci]"
                    currentBuild.result = 'NOT_BUILT'
                    error("Skipping build due to [skip ci] in commit message")
                }
            }
            }
        }
    } 
    stage('Prerequisites') {
      // Check if the prerequisites are met
      steps { 
        withEnv([
          "JAVA_HOME=${JDK17_HOME}",
          "PATH=${JDK17_HOME}/bin:${EXTRA_PATH}:${env.PATH ?: ''}"
        ]) {
          sh ''' 
            set -eu
            echo "PATH=$PATH"
            echo "JAVA_HOME=$JAVA_HOME"

            command -v git
            command -v node
            command -v npm
            command -v mvn
 
            git --version
            node --version
            npm --version
            java -version
            mvn -version
          '''
        }
      }
    }

    stage('Build') {
      // Build the frontend and backend in parallel
      parallel {
        // Build the frontend
        stage('Build Frontend') {
          steps {
            dir('frontend') {
              // Set the path to the frontend
              withEnv(["PATH=${EXTRA_PATH}:${env.PATH ?: ''}"]) {
                sh 'npm ci'
                // Build the frontend
                sh 'npm run build'
              }
            }
          }
          post {
            success {
              // Archive the frontend artifacts
              archiveArtifacts artifacts: 'frontend/dist/**', fingerprint: true
            }
          }
        }

        // Build the backend
        stage('Build Backend') {
          steps {
            dir('backend') {
              // Set the path to the backend
              withEnv([
                "JAVA_HOME=${JDK17_HOME}",
                "PATH=${JDK17_HOME}/bin:${EXTRA_PATH}:${env.PATH ?: ''}"
              ]) {
                // Package the backend
                sh 'mvn -B clean package -DskipTests'
              }
            }
          }
          post {
            success {
              // Archive the backend artifacts
              archiveArtifacts artifacts: 'backend/target/*.jar', allowEmptyArchive: true, fingerprint: true
            }
          }
        }
      }
    }

    stage('Test') {
      // Test the frontend and backend in parallel
      parallel {
        // Test the frontend
        stage('Test Frontend + Lint') {
          steps {
            dir('frontend') {
              // Set the path to the frontend
              withEnv(["PATH=${EXTRA_PATH}:${env.PATH ?: ''}"]) {
                sh 'npm ci'
                // Test the frontend
                sh 'npm run test -- --run'
                // Lint the frontend
                sh 'npm run lint'
                // Check the frontend formatting
                sh 'npm run format:check'
              }
            }
          }
          post {
            always {
              // Archive the frontend coverage
              junit 'frontend/test-results/junit.xml'
              archiveArtifacts artifacts: 'frontend/coverage/**', allowEmptyArchive: true
            }
          }
        }

        // Test the backend
        stage('Test Backend') {
          steps {
            dir('backend') {
              withEnv([
                "JAVA_HOME=${JDK17_HOME}",
                "PATH=${JDK17_HOME}/bin:${EXTRA_PATH}:${env.PATH ?: ''}"
              ]) {
                // Test the backend
                sh 'mvn -B test'
              }
            }
          }
          post {
            always {
              // Archive the backend test results
              junit 'backend/target/surefire-reports/TEST-*.xml'
            }
          }
        }
      }
    }

    stage('Package (Docker Hub)') {
        steps {
            withEnv(["PATH=${EXTRA_PATH}:${env.PATH ?: ''}"]) {
                script {
                    def tag = env.GIT_COMMIT_SHORT ?: 'local'
                    def REPO = "docker.io/mehabadi/test"

                    sh 'docker version'

                    withCredentials([usernamePassword(
                        credentialsId: 'docker-hub',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    }

                    sh "docker build -t ${REPO}:frontend-${tag} -t ${REPO}:frontend-latest ./frontend"
                    sh "docker build -t ${REPO}:backend-${tag} -t ${REPO}:backend-latest ./backend"

                    sh "docker push ${REPO}:frontend-${tag} && docker push ${REPO}:frontend-latest"
                    sh "docker push ${REPO}:backend-${tag} && docker push ${REPO}:backend-latest"
                }
            }
        }
    }

    // =========================================================================
    // GitOps: Update Helm values with new image tags and push to Git
    // This triggers ArgoCD to automatically deploy the new version
    // =========================================================================
    stage('Update Helm Values (GitOps)') {
        // when {
        //     // Only run on main branch
        //     branch 'main'
        // }
        steps {
            withEnv(["PATH=${EXTRA_PATH}:${env.PATH ?: ''}"]) {
                script {
                    def tag = env.GIT_COMMIT_SHORT ?: 'local'
                    def valuesFile = 'helm/address-picker/values.yaml'
                    
                    // Update image tags in values.yaml using sed
                    sh """
                        # Update backend image tag
                        sed -i '' 's/tag: backend-.*/tag: backend-${tag}/' ${valuesFile} || \
                        sed -i 's/tag: backend-.*/tag: backend-${tag}/' ${valuesFile}
                        
                        # Update frontend image tag
                        sed -i '' 's/tag: frontend-.*/tag: frontend-${tag}/' ${valuesFile} || \
                        sed -i 's/tag: frontend-.*/tag: frontend-${tag}/' ${valuesFile}
                        
                        echo "Updated ${valuesFile} with tag: ${tag}"
                        cat ${valuesFile} | grep -A2 "image:"
                    """
                    
                    // Configure Git
                    sh '''
                        git config user.email "jenkins@localhost"
                        git config user.name "Jenkins CI"
                    '''
                    
                    // Check if there are changes to commit
                    def changes = sh(script: "git diff --quiet ${valuesFile} || echo 'changed'", returnStdout: true).trim()
                    
                    if (changes == 'changed') {
                        // Commit and push
                        // [skip ci] prevents infinite loop (Jenkins won't trigger on this commit)
                        withCredentials([usernamePassword(
                            credentialsId: 'github-credentials',
                            usernameVariable: 'GIT_USER',
                            passwordVariable: 'GIT_TOKEN'
                        )]) {
                            sh """
                                git add ${valuesFile}
                                git commit -m "chore: update image tags to ${tag} [skip ci]"
                                git push https://\${GIT_USER}:\${GIT_TOKEN}@github.com/mmahabadi/address-picker-react.git HEAD:main
                            """
                        }
                        echo "✅ Pushed new image tags to Git. ArgoCD will auto-deploy!"
                    } else {
                        echo "ℹ️ No changes to Helm values (tags already up to date)"
                    }
                }
            }
        }
    }
  }

  post {
    always {
      // Clean the workspace
      cleanWs()
    }
  }
}