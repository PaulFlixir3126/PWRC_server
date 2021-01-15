*** Settings ***
Library           RequestsLibrary
Library           Collections
Library           OperatingSystem
Test Setup        Create Sessions

*** Variable ***
${url}          http://3.92.189.126:8545/api/bo

*** Keywords ***
Create Sessions
    ${headers}=    Create Dictionary    Content-Type=application/json
    Create Session    BrandDetails    ${url}    headers=${headers}

Get Input Data
    [Arguments]   ${file} 
    ${File}=  Evaluate  json.load(open("${file}", "r"))  json
    [return]  ${File}

Api Call For Create Brand Details
    [Arguments]   ${File}
    ${Object}=  Post Request  BrandDetails  /brands  data=${File}
    Evaluate  open("brand_id.json", "w").write('{"brand_id":"${Object.json()["body"]["brand_id"]}"}')
    [return]  ${Object}

Get length for the File
    [Arguments]  ${File}
    ${keys}=     Get Dictionary Keys     ${File}
    Sort List     ${keys}
    ${lenkeys}  Get Length   ${keys}
    [return]  ${lenkeys}

Check Api Response BrandDetails 
    [Arguments]   ${File}   ${Object}  
    Should be equal    ${Object.json()["status"]}     ${True}
    Should be equal    ${Object.json()["message"]}    success

Api Call For Get Brand Details
    [Arguments]  ${Object}
    ${result}=  Get Request  BrandDetails   /brands?id=${Object['brand_id']}
    #log to console  ${result.content}
    [return]  ${result}

Check Get Brand Details Length
    [Arguments]   ${Len}   ${result}
    Run Keyword If  "${Len}" != "0"   Log  ${result.status_code}   
    ...   ELSE   Should Be Equal  ${result.status_code}  ${200}

Check Api Get Response Brand Details
    [Arguments]   ${result}  ${Object}  
    Should be equal    ${result.json()["status"]}     ${True}
    Should be equal    ${result.json()["message"]}    success

Check Brand name is Unique name
    [Arguments]   ${result}  ${Object}
    Should Be Equal    ${result.json()["body"][0]['brand_name']}    Shanmuka

Api Call For Update Brand Details
    [Arguments]   ${Object1}   
    ${result}=  Put Request  BrandDetails  /brands  data=${Object1}
    [return]  ${result}

Check Api Response Update BrandDetails 
    [Arguments]   ${result}   ${Object1}  
    Should be equal    ${result.json()["status"]}     ${True}
    Should be equal    ${result.json()["message"]}    success

Api Call For Delete Brand Details
    [Arguments]   ${Object}
    ${result}=  Delete Request  BrandDetails  /brands?id=${Object['brand_id']}
    [return]  ${result}

Check Api Delete Response Items Details
    [Arguments]   ${Object}   ${result}  
    Should be equal    ${result.json()["status"]}     ${True}
    Should be equal    ${result.json()["message"]}    success

Check Type Of Brand Details   
    [Arguments]   ${File}   ${Object}

    ${brand_name}  Evaluate    type($File["brand_name"]).__name__

    Run Keyword If  "${File["brand_name"]}" != ""  Should be equal  ${Object.json()['status']}  ${True}
    ...    ELSE IF  ${brand_name} == str  Should be equal  ${Object.json()['status']}  ${True}
    ...    ELSE  Should be equal  ${Object.json()['status']}  ${False}

*** Test Cases ***
Brand Details: As an user, i can able to create Brand Details (Post) 
    [Tags]   Positive
    ${File}  Get Input Data  Brands.json
    ${Object}  Api Call For Create Brand Details  ${File}
    Check Api Response BrandDetails  ${File}  ${Object}
    ${lenkeys}  Get length for the File  ${File}
    Check Type Of Brand Details  ${File}  ${Object}

Brand Details: As an user, i can able to Get Brand Details (Get)  
    [Tags]   Positive 
    ${Object}  Get Input Data  brand_id.json  
    ${result}  Api Call For Get Brand Details  ${Object}
    Check Api Get Response Brand Details  ${result}  ${Object}
    Check Brand name is Unique name  ${result}  ${Object}
    ${Len}  Get Length  ${result.json()["body"]}
    Check Get Brand Details Length  ${Len}  ${result}
    
Brand Details: As an user, i can able to Update Brand Details (Update) 
    [Tags]   Positive
    ${Object}  Get Input Data  brand_id.json
    ${Object1}  Get Input Data  Brand.json
    set to dictionary    ${Object1}    brand_id=${Object['brand_id']}
    ${result}  Api Call For Update Brand Details  ${Object1}      
    Check Api Response Update BrandDetails  ${result}  ${Object1}

Brand Details: As an user, i can able to Delete Brand Details (Delete)
    [Tags]   Positive
    ${Object}  Get Input Data  brand_id.json
    ${result}  Api Call For Delete Brand Details  ${Object}
    Check Api Delete Response Items Details  ${Object}  ${result} 