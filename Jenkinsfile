pipeline {
    agent none 
    stages {
        

        stage('VLAB') {

            agent {label 'VLAB'}

            steps {

                dir('/usr/HOUND/app/'){sh 'git pull origin master'}

                dir('/usr/HOUND/app/'){
                    sh '''#!/bin/bash 
                          source /usr/HOUND/env/bin/activate
                          pip install -r requirements.txt --no-warn-script-location
                          deactivate
                       '''
                    }
                
                dir('/usr/HOUND/app/'){
                    sh '''#!/bin/bash 
                          source /usr/HOUND/env/bin/activate
                          python3 manage.py migrate
                          deactivate
                       '''
                    } 
                
                sh 'sudo systemctl restart cld_sync.bg'

                sh 'sudo systemctl status cld_sync.bg'

                sh 'sudo systemctl restart uptime.sync'

                sh 'sudo systemctl status uptime.sync'

                sh 'sudo systemctl restart gunicorn'

                sh 'sudo systemctl status gunicorn'
            }

            post {
                success {
                    dir('/usr/HOUND/app/'){sh 'python3 teamWaitingCard.py $BUILD_DISPLAY_NAME $STAGE_NAME'}
                }
                failure {
                    dir('/usr/HOUND/app/'){sh 'python3 teamFailureCard.py $BUILD_DISPLAY_NAME $STAGE_NAME'}
                }
            }
          
        }

        stage('Verification') {

            parallel {

                stage('Application Test') {

                    agent {label 'VLAB'}

                    steps {
                
                        dir('/usr/HOUND/app/'){
                            sh '''#!/bin/bash
                                source /usr/HOUND/env/bin/activate
                                python3 manage.py test
                                deactivate
                            '''
                        }
                    }
                }

                stage('Package Version Check') {
                    
                    agent {label 'VLAB'}

                    steps {
                        dir('/usr/HOUND/app/'){
                            sh '''#!/bin/bash
                                source /usr/HOUND/env/bin/activate
                                pip-check
                                deactivate
                            '''
                            }
                        }
                }

                stage('Package Security Check') {
                    
                    agent {label 'VLAB'}
                    
                    steps {
                        dir('/usr/HOUND/app/'){
                            sh '''#!/bin/bash
                                source /usr/HOUND/env/bin/activate
                                safety check
                                deactivate
                            '''
                            }
                        }
                }

            }
        }

        stage('Production') {

            parallel {

                stage('S4-HOUND') {

                    agent {label 'PROD'}

                    input {
                        message "Please confirm to deploy in Production?"
                        ok "Confirm"
                    }
                    
                    steps {

                        dir('/usr/HOUND/HOUND/'){sh 'git pull origin master'}

                        dir('/usr/HOUND/HOUND/'){
                            sh '''#!/bin/bash 
                                source /usr/HOUND/env/bin/activate
                                pip install -r requirements.txt --no-warn-script-location
                                deactivate
                            '''
                            }
                        
                        dir('/usr/HOUND/HOUND/'){
                            sh '''#!/bin/bash 
                                source /usr/HOUND/env/bin/activate
                                python3 manage.py migrate
                                deactivate
                            '''
                            }

                        sh 'sudo systemctl restart arc_cld_sync.bg'

                        sh 'sudo systemctl status arc_cld_sync.bg'

                        sh 'sudo systemctl restart arc_pingdom.sync'

                        sh 'sudo systemctl status arc_pingdom.sync'

                        sh 'sudo systemctl restart arc_uptime.sync'

                        sh 'sudo systemctl status arc_uptime.sync'

                        sh 'sudo systemctl restart arc_gunicorn'

                        sh 'sudo systemctl status arc_gunicorn'

                        dir('/usr/HOUND/HOUND/'){
                            sh '''#!/bin/bash 
                                source /usr/HOUND/env/bin/activate
                                python3 manage.py schedule_jobs -r
                                deactivate
                            '''
                            }
                    }

                }

                stage('IBP-HOUND') {

                    agent {label 'IBPPROD'}

                    input {
                        message "Please confirm to deploy in Production?"
                        ok "Confirm"
                    }
                    
                    steps {

                        dir('/usr/HOUND/HOUND/'){sh 'git pull origin master'}

                        dir('/usr/HOUND/HOUND/'){
                            sh '''#!/bin/bash 
                                source /usr/HOUND/env/bin/activate
                                pip install -r requirements.txt --no-warn-script-location
                                deactivate
                            '''
                            }
                        
                        
                        dir('/usr/HOUND/HOUND/'){
                            sh '''#!/bin/bash 
                                source /usr/HOUND/env/bin/activate
                                python3 manage.py migrate
                                deactivate
                            '''
                            }

                        sh 'sudo systemctl restart arc_cld_sync.bg'

                        sh 'sudo systemctl status arc_cld_sync.bg'

                        sh 'sudo systemctl restart arc_pingdom.sync'

                        sh 'sudo systemctl status arc_pingdom.sync'

                        sh 'sudo systemctl restart arc_uptime.sync'

                        sh 'sudo systemctl status arc_uptime.sync'

                        sh 'sudo systemctl restart arc_gunicorn'

                        sh 'sudo systemctl status arc_gunicorn'

                        dir('/usr/HOUND/HOUND/'){
                            sh '''#!/bin/bash 
                                source /usr/HOUND/env/bin/activate
                                python3 manage.py schedule_jobs -r
                                deactivate
                            '''
                            }
                    }

                }

            }

        }
    }
}
