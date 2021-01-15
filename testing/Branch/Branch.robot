*** settings ***
Library           Collections
Library           OperatingSystem
Library           RequestsLibrary
Test Setup        Create Sessions

*** Variable ***

${url}          http://3.92.189.126:8545/api/bo


*** Keywords ***
Create Sessions
    ${headers}=    Create Dictionary    Content-Type=application/json
    Create Session    BranchDetails    ${url}    headers=${headers}

Get Input Data
    [Arguments]  ${file}
    ${File}=  Evaluate  json.load(open("${file}", "r"))  json
    [return]  ${File}

Api Call For Create Branch Details
    [Arguments]  ${File}
    ${Object}=  Post Request  BranchDetails  /branches  data=${File}
    Evaluate  open("Branch_id.json", "w").write('{"branch_id":"${Object.json()["body"]["branch_id"]}"}')  
    [return]  ${Object}

Validation check api Type response for Branch Details
    [Arguments]  ${Object}
    Should Be Equal As Strings  ${Object.status_code}  200
    ${emptydict}   create dictionary
    should not be equal  ${Object.json()}  ${emptydict}

Check Api Response Branch Details 
    [Arguments]   ${File}   ${Object}  
    Should be equal    ${Object.json()["status"]}     ${True}
    Should be equal    ${Object.json()["message"]}    success

Get length for the File
    [Arguments]  ${File}
    ${keys}=     Get Dictionary Keys     ${File}
    Sort List     ${keys}
    ${lenkeys}  Get Length   ${keys}
    [return]  ${lenkeys}


Api Call For Get Branch Details
    [Arguments]  ${File}
    ${result}=  Get Request  BranchDetails  /branches?id=${File["branch_id"]}
    [return]  ${result}

Check Get Branch Details Length
    [Arguments]   ${Len}   ${result}
    Run Keyword If  "${Len}" != "0"   Log  ${result.status_code}   
    ...   ELSE   Should Be Equal  ${result.status_code}  ${200}

Check Api Response Get Branch Details
    [Arguments]   ${File}  ${result}     
    Should be equal    ${result.json()["status"]}     ${True}
    Should be equal    ${result.json()["message"]}    success      

Api Call For Update Branch Details
    [Arguments]  ${Object1}   
    ${result}=  Put Request  BranchDetails  /branches  data=${Object1}
    [return]  ${result}

Check Api Response Update Branch Details
    [Arguments]  ${Object1}  ${result}
    Should be equal    ${result.json()["status"]}     ${True}
    Should be equal    ${result.json()["message"]}    success

Api Call For Delete Branch Details
    [Arguments]  ${File}
    ${Object}=  Delete request  BranchDetails  /branches?id=${File["branch_id"]}
    [return]  ${Object}

Check Api Response Delete Branch Details
    [Arguments]   ${File}   ${Object}  
    Should be equal    ${Object.json()["status"]}     ${True}
    Should be equal    ${Object.json()["message"]}    success


*** Test Cases ***
Branch Details: As an User, i can able to create Branch Details
    [Tags]    Positive
    ${File}  Get Input Data  Branchdetails.json
    ${Object}  Api Call For Create Branch Details  ${File}  
    Check Api Response Branch Details  ${File}  ${Object}
    Validation check api Type response for Branch Details  ${Object}
    ${lenkeys}  Get length for the File  ${File}

Branch Details: As an User, i can able to Get Branch Details 
    [Tags]    Positive
    ${File}  Get Input Data   Branch_id.json    
    ${result}  Api Call For Get Branch Details  ${File}   
    Check Api Response Get Branch Details  ${File}  ${result} 
    ${Len}  Get Length  ${result.json()["body"]}
    Check Get Branch Details Length  ${Len}  ${result}

Branch Details: As an User, i can able to Update Branch Details 
    [Tags]    Positive
    ${Object}  Get Input Data   Branch_id.json
    ${Object1}  Get Input Data  Branchesdetails.json 
    set to dictionary    ${Object1}    branch_id=${Object['branch_id']}
    ${result}  Api Call For Update Branch Details  ${Object1}
    Check Api Response Update Branch Details  ${Object1}  ${result}    

Branch Details: As an User, i can able to Delete Branch Details 
    [Tags]    Positive
    ${File}  Get Input Data   Branch_id.json
    ${Object}  Api Call For Delete Branch Details  ${File}
    Check Api Response Delete Branch Details  ${File}  ${Object}