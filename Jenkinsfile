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
    EXTRA_PATH = '/opt/homebrew/opt/node@22/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin'

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
            // Get the short commit hash
            script {
                env.GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                echo "Commit: ${env.GIT_COMMIT_SHORT}"
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
            script {
                def tag = env.GIT_COMMIT_SHORT ?: 'local'
                // change these to your Docker Hub namespace + image names
                def FE_IMAGE = "docker.io/mehabadi/test:frontend-${tag}"
                def BE_IMAGE = "docker.io/mehabadi/test:backend-${tag}"

                sh 'docker version'

                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                }

                sh "docker build -t ${FE_IMAGE} ./frontend"
                sh "docker build -t ${BE_IMAGE} ./backend"

                sh "docker push ${FE_IMAGE}"
                sh "docker push ${BE_IMAGE}"
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