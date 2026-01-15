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
    
    parameters {
        // If empty, uses checkout scm (best with "Pipeline script from SCM")
        // If you want, you can build from a local repo:
        //   file:///Users/<you>/Repository/address-picker-react/.git
        string(name: 'GIT_URL', defaultValue: '', description: 'Optional override Git repo URL. Leave empty to use checkout scm.')
        string(name: 'GIT_BRANCH', defaultValue: 'main', description: 'Branch to build when using GIT_URL.')
        string(name: 'GIT_CREDENTIALS_ID', defaultValue: '', description: 'Jenkins credentials ID for Git (optional).')

        booleanParam(name: 'BUILD_DOCKER_IMAGES', defaultValue: false, description: 'Build Docker images (requires docker on Jenkins machine).')
        booleanParam(name: 'PUSH_DOCKER_IMAGES', defaultValue: false, description: 'Push Docker images (requires DOCKER_REGISTRY + DOCKER_CREDENTIALS_ID).')
        string(name: 'DOCKER_REGISTRY', defaultValue: '', description: 'e.g. docker.io or registry.gitlab.com (optional). Empty = local-only tags.')
        string(name: 'DOCKER_CREDENTIALS_ID', defaultValue: '', description: 'Jenkins credentials ID for docker login (optional).')

        string(name: 'FRONTEND_IMAGE', defaultValue: 'address-picker-frontend', description: 'Docker image name for frontend.')
        string(name: 'BACKEND_IMAGE', defaultValue: 'address-picker-backend', description: 'Docker image name for backend.')
    }

    environment {
        // populated after checkout
        GIT_COMMIT_SHORT = ''
        // macOS homebrew paths are often missing from Jenkins' PATH when Jenkins runs as a service.
        // This helps Jenkins find node/npm/mvn installed via Homebrew.
        EXTRA_PATH = '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin',

        JDK17_HOME = '/opt/homebrew/opt/openjdk@17'
    }
    
    // Options: Pipeline-wide settings
    options {
        // Keep build history
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Timeout after 30 minutes
        timeout(time: 30, unit: 'MINUTES')
        // Add timestamps to console output
        timestamps()
        // Note: no GitLab/Jenkins integration required for local Jenkins + GitHub
        // Avoid Jenkins doing an automatic checkout before our own Checkout stage.
        skipDefaultCheckout(true)
    }
    
    // Stages: Define the pipeline flow
    stages {
        // ====================================================================
        // STAGE 1: CHECKOUT
        // ====================================================================
        stage('Checkout') {
            steps {
                // Ensure our PATH includes common locations for locally installed tools
                withEnv(["PATH=${EXTRA_PATH}:${env.PATH ?: ''}"]) {
                script {
                    if (params.GIT_URL?.trim()) {
                        def cfg = [
                            $class: 'GitSCM',
                            branches: [[name: "*/${params.GIT_BRANCH}"]],
                            userRemoteConfigs: [[url: params.GIT_URL.trim()]]
                        ]
                        if (params.GIT_CREDENTIALS_ID?.trim()) {
                            cfg.userRemoteConfigs = [[url: params.GIT_URL.trim(), credentialsId: params.GIT_CREDENTIALS_ID.trim()]]
                        }
                        checkout(cfg)
                    } else {
                        checkout scm
                    }
                }
                script {
                    env.GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    echo "Commit: ${env.GIT_COMMIT_SHORT}"
                }
                }
            }
        }

        stage('Prerequisites') {
            steps {
                withEnv(["PATH=${EXTRA_PATH}:${env.PATH ?: ''}"]) {
                    sh '''
                      set -eu
                      echo "PATH=$PATH"

                      echo "Checking required tools..."
                      command -v git >/dev/null 2>&1 || { echo "ERROR: git not found in PATH"; exit 1; }
                      command -v java >/dev/null 2>&1 || { echo "ERROR: java not found in PATH"; exit 1; }

                      if ! command -v node >/dev/null 2>&1; then
                        echo "ERROR: node not found in PATH (Jenkins user can't see Node.js)."
                        echo "Fix (macOS/homebrew): install Node and ensure Jenkins PATH includes /opt/homebrew/bin"
                        echo "  brew install node"
                        exit 1
                      fi

                      if ! command -v npm >/dev/null 2>&1; then
                        echo "ERROR: npm not found in PATH."
                        echo "Fix: Node.js install provides npm. Reinstall Node:"
                        echo "  brew install node"
                        exit 1
                      fi

                      if ! command -v mvn >/dev/null 2>&1; then
                        echo "ERROR: mvn not found in PATH (Jenkins user can't see Maven)."
                        echo "Fix (macOS/homebrew):"
                        echo "  brew install maven"
                        exit 1
                      fi

                      echo "Tool versions:"
                      git --version
                      java -version
                      node --version
                      npm --version
                      mvn -version
                    '''
                }
            }
        }
        
        // ====================================================================
        // STAGE 2: BUILD
        // ====================================================================
        stage('Build') {
            // Run frontend and backend builds in parallel
            parallel {
                // Frontend Build
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            script {
                                // Ensure Jenkins can find node/npm
                                withEnv(["PATH=${EXTRA_PATH}:${env.PATH ?: ''}", "HUSKY=0"]) {
                                echo "Installing dependencies..."
                                sh 'npm ci'
                                echo "Building React application..."
                                sh 'npm run build'
                                }
                            }
                        }
                    }
                    post {
                        success {
                            echo "Frontend build successful!"
                            archiveArtifacts artifacts: 'frontend/dist/**/*', fingerprint: true
                        }
                        failure {
                            echo "Frontend build failed!"
                        }
                    }
                }
                
                // Backend Build
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            script {
                                withEnv([
                                    "JAVA_HOME=${JDK17_HOME}",
                                    "PATH=${EXTRA_PATH}:${env.PATH ?: ''}"]) {
                                echo "Compiling Spring Boot application..."
                                sh 'mvn -B clean compile -DskipTests'
                                }
                            }
                        }
                    }
                    post {
                        success {
                            echo "Backend build successful!"
                            archiveArtifacts artifacts: 'backend/target/*.jar', fingerprint: true
                        }
                        failure {
                            echo "Backend build failed!"
                        }
                    }
                }
            }
        }
        
        // ====================================================================
        // STAGE 3: TEST
        // ====================================================================
        stage('Test') {
            parallel {
                // Frontend Tests
                stage('Test Frontend') {
                    steps {
                        dir('frontend') {
                            script {
                                withEnv(["PATH=${EXTRA_PATH}:${env.PATH ?: ''}"]) {
                                echo "Running frontend tests..."
                                sh 'npm ci'
                                sh 'npm run test -- --run'
                                }
                            }
                        }
                    }
                    post {
                        always {
                            // Publish test results
                            junit 'frontend/test-results/junit.xml'
                            // Coverage publishing requires extra plugins; archive coverage instead
                            archiveArtifacts artifacts: 'frontend/coverage/**', allowEmptyArchive: true
                        }
                    }
                }
                
                // Frontend Lint
                stage('Lint Frontend') {
                    steps {
                        dir('frontend') {
                            script {
                                withEnv(["PATH=${EXTRA_PATH}:${env.PATH ?: ''}"]) {
                                echo "Linting frontend code..."
                                sh 'npm ci'
                                sh 'npm run lint'
                                sh 'npm run format:check'
                                }
                            }
                        }
                    }
                }
                
                // Backend Tests
                stage('Test Backend') {
                    steps {
                        dir('backend') {
                            script {
                                withEnv(["PATH=${EXTRA_PATH}:${env.PATH ?: ''}"]) {
                                echo "Running backend tests..."
                                sh 'mvn test'
                                }
                            }
                        }
                    }
                    post {
                        always {
                            // Publish test results
                            junit 'backend/target/surefire-reports/TEST-*.xml'
                        }
                    }
                }
            }
        }
        
        // ====================================================================
        // STAGE 4: PACKAGE (Docker)
        // ====================================================================
        stage('Package (Docker)') {
            when {
                expression { return params.BUILD_DOCKER_IMAGES }
            }
            parallel {
                // Frontend Docker
                stage('Build Frontend Docker Image') {
                    steps {
                        script {
                            dir('frontend') {
                                echo "Building frontend Docker image..."
                                def imageTag = "${params.FRONTEND_IMAGE}:${env.GIT_COMMIT_SHORT}"
                                def latestTag = "${params.FRONTEND_IMAGE}:latest"
                                
                                // Build image
                                sh """
                                    docker build -t ${imageTag} -t ${latestTag} .
                                """
                                
                                // Tag with registry
                                if (params.DOCKER_REGISTRY?.trim()) {
                                    sh """
                                        docker tag ${imageTag} ${params.DOCKER_REGISTRY}/${imageTag}
                                        docker tag ${latestTag} ${params.DOCKER_REGISTRY}/${latestTag}
                                    """
                                }
                            }
                        }
                    }
                }
                
                // Backend Docker
                stage('Build Backend Docker Image') {
                    steps {
                        script {
                            dir('backend') {
                                echo "Building backend Docker image..."
                                def imageTag = "${params.BACKEND_IMAGE}:${env.GIT_COMMIT_SHORT}"
                                def latestTag = "${params.BACKEND_IMAGE}:latest"
                                
                                // Build image
                                sh """
                                    docker build -t ${imageTag} -t ${latestTag} .
                                """
                                
                                // Tag with registry
                                if (params.DOCKER_REGISTRY?.trim()) {
                                    sh """
                                        docker tag ${imageTag} ${params.DOCKER_REGISTRY}/${imageTag}
                                        docker tag ${latestTag} ${params.DOCKER_REGISTRY}/${latestTag}
                                    """
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // ====================================================================
        // STAGE 5: PUSH (Optional)
        // ====================================================================
        stage('Push to Registry') {
            when { expression { return params.PUSH_DOCKER_IMAGES && params.DOCKER_REGISTRY?.trim() && params.DOCKER_CREDENTIALS_ID?.trim() } }
            steps {
                script {
                    // Login to Docker registry
                    withCredentials([usernamePassword(
                        credentialsId: params.DOCKER_CREDENTIALS_ID,
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh "echo ${DOCKER_PASS} | docker login ${params.DOCKER_REGISTRY} -u ${DOCKER_USER} --password-stdin"
                        
                        // Push frontend image
                        dir('frontend') {
                            def imageTag = "${params.DOCKER_REGISTRY}/${params.FRONTEND_IMAGE}:${env.GIT_COMMIT_SHORT}"
                            def latestTag = "${params.DOCKER_REGISTRY}/${params.FRONTEND_IMAGE}:latest"
                            sh "docker push ${imageTag}"
                            sh "docker push ${latestTag}"
                        }
                        
                        // Push backend image
                        dir('backend') {
                            def imageTag = "${params.DOCKER_REGISTRY}/${params.BACKEND_IMAGE}:${env.GIT_COMMIT_SHORT}"
                            def latestTag = "${params.DOCKER_REGISTRY}/${params.BACKEND_IMAGE}:latest"
                            sh "docker push ${imageTag}"
                            sh "docker push ${latestTag}"
                        }
                    }
                }
            }
        }
    }
    
    // ========================================================================
    // POST ACTIONS: Run after all stages complete
    // ========================================================================
    post {
        // Always run these
        always {
            script {
                echo "Pipeline completed!"
                echo "Build Number: ${BUILD_NUMBER}"
                echo "Status: ${currentBuild.currentResult}"
            }
            // Clean up workspace
            cleanWs()
        }
        
        // Run on success
        success {
            echo "Pipeline succeeded! ✅"
            // Could send notifications here (email, Slack, etc.)
        }
        
        // Run on failure
        failure {
            echo "Pipeline failed! ❌"
            // Could send failure notifications here
        }
        
        // Run on unstable (tests failed but build succeeded)
        unstable {
            echo "Pipeline is unstable (some tests failed)"
        }
    }
}
