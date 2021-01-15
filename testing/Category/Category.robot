*** settings ***
Library           Collections
Library           OperatingSystem
Library           RequestsLibrary
Test Setup        Create Sessions


*** Variable ***
${url}            http://3.92.189.126:8545/api/bo


*** Keywords ***
Create Sessions
    ${headers}=    Create Dictionary    Content-Type=application/json
    Create Session    CategoryDetails    ${url}    headers=${headers}

Get Input Data
    [Arguments]   ${file}
    ${File}=  Evaluate  json.load(open("${file}","r"))  json
    [return]  ${File}

Api Call For Create Category Details
    [Arguments]   ${File}
    ${Object}=  Post Request  CategoryDetails   /category  data=${File}
    Evaluate  open("Category_id.json", "w").write('{"category_id":"${Object.json()["body"]["category_id"]}"}')
    [return]  ${Object}

Check Api Response CategoryDetails
    [Arguments]   ${File}   ${Object}
    Should Be Equal  ${Object.json()["status"]}   ${True}
    Should Be Equal  ${Object.json()["message"]}   success

Get length for the File
    [Arguments]  ${File}
    ${keys}=     Get Dictionary Keys     ${File}
    Sort List     ${keys}
    ${lenkeys}  Get Length   ${keys}
    [return]  ${lenkeys}

Check Type Of Category Details   
    [Arguments]   ${File}   ${Object}

    ${category_name}  Evaluate    type($File["category_name"]).__name__

    Run Keyword If  "${File["category_name"]}" != ""  Should be equal  ${Object.json()['status']}  ${True}
    ...    ELSE IF  ${category_name} == str  Should be equal  ${Object.json()['status']}  ${True}
    ...    ELSE  Should be equal  ${Object.json()['status']}  ${False}

Api Call For Get Category Details
    [Arguments]   ${Object}  
    ${result}=  Get Request  CategoryDetails   /category?id=${Object["category_id"]}
    [return]  ${result}

Check Get Category Details Length
    [Arguments]   ${Len}   ${result}
    Run Keyword If  "${Len}" != "0"   Log  ${result.status_code}   
    ...   ELSE   Should Be Equal  ${result.status_code}  ${200}

Check the Category Details
    [Arguments]   ${Object}   
    ${Len}=  Get Length  ${Object.json()["body"]}

    Run Keyword If  "${len}" != "0"   Log  ${Object.status_code}   
    ...   ELSE   Should Be Equal  ${Object.status_code}  ${200}

Check Api Get Response Category Details
    [Arguments]   ${result}   ${Object}  
    Should Be Equal  ${result.json()["status"]}   ${True}
    Should Be Equal  ${result.json()["message"]}   success

Api Call For Update Category Details
    [Arguments]   ${File}
    ${Object}=  Put Request  CategoryDetails   /category  data=${File}
    [return]  ${Object}

Check Api Update Response Category Details  
    [Arguments]   ${File}  ${result}
    Should Be Equal  ${result.json()["status"]}   ${True}
    Should Be Equal  ${result.json()["message"]}   success

Check Type Update details
    [Arguments]   ${File}   ${result}
    Should Be Equal  ${result.json()["body"][1][-1]["category_name"]}  ${File["category_name"]}

Api Call For Delete Category Details
    [Arguments]   ${File}
    ${Object}=  Delete Request  CategoryDetails   /category?id=${File["category_id"]}
    [return]  ${Object}

Check Api Delete Response Category Details
    [Arguments]   ${File}   ${Object}
    Should be equal    ${Object.json()["status"]}    ${True}
    Should be equal    ${Object.json()["message"]}    success


*** Test Cases ***
Category: As an user, i can able to Post Category Details and status
    [Tags]   Positive
    ${File}  Get Input Data  Category.json
    ${Object}  Api Call For Create Category Details  ${File}
    Check Api Response CategoryDetails  ${File}  ${Object}
    ${lenkeys}  Get length for the File  ${File}
    Check Type Of Category Details  ${File}  ${Object}
    Check the Category Details  ${Object}  

Category: As an user, i can able to Get Category Details and status
    [Tags]   Positive 
    ${Object}  Get Input Data  Category_id.json   
    ${result}  Api Call For Get Category Details  ${Object}
    Check Api Get Response Category Details  ${result}  ${Object}
    ${Len}  Get Length  ${result.json()["body"]}
    Check Get Category Details Length  ${Len}  ${result}
    
Category: As an user, i can able to Update Category Details and status
    [Tags]   Positive
    ${Object}  Get Input Data  Category_id.json
    ${File}  Get Input Data  Categorys.json
    set to dictionary    ${File}    category_id=${Object['category_id']}
    ${result}  Api Call For Update Category Details  ${File}
    Check Api Update Response Category Details  ${File}  ${result}
    Check Type Update details  ${File}  ${result}

Category: As an user, i can able to Delete Category Details and status
    [Tags]   Positive
    ${File}  Get Input Data  Category_id.json
    ${Object}  Api Call For Delete Category Details  ${File}  
    Check Api Delete Response Category Details  ${File}  ${Object}