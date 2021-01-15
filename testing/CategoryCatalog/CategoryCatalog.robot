*** Settings ***
Library        OperatingSystem
Library        Collections
Library        RequestsLibrary
Test Setup     Create Sessions



*** Variable ***
${url}    http://3.92.189.126:8545/api/bo


*** Keywords ***
Create Sessions
    ${headers}=    Create Dictionary    Content-Type=application/json
    Create Session    CategoryCatalogDetails    ${url}    headers=${headers}

Get File Data
    [Arguments]   ${file}
    ${File}=  Evaluate  json.load(open("${file}","r"))  json
    [return]  ${File}

Api Call For Create Category Catalog Details
    [Arguments]   ${File}
    ${Object}=  Post Request  CategoryCatalogDetails  /categoryCatalog  data=${File}
    Evaluate  open("CategoryCatalog_id.json", "w").write('{"category_id":"${Object.json()["body"]["category_id"]}"}')
    [return]  ${Object}

Check Api Response Category Catalog Details
    [Arguments]   ${File}   ${Object}
    Should Be Equal  ${Object.json()["status"]}   ${True}
    Should Be Equal  ${Object.json()["message"]}   success

Validation Check Type Category Catalog Details
    [Arguments]  ${Object}
    Should Be Equal As Strings  ${Object.status_code}  200
    ${emptydict}   create dictionary
    should not be equal  ${Object.json()}  ${emptydict}

Get length for the File
    [Arguments]  ${File}
    ${keys}=     Get Dictionary Keys     ${File}
    Sort List     ${keys}
    ${lenkeys}  Get Length   ${keys}
    [return]  ${lenkeys}

Api Call For Get Category Catalog Details
    [Arguments]  ${File}
    ${result}=  Get Request  CategoryCatalogDetails   /categoryCatalog?id=${File["category_id"]}
    [return]  ${result}

Check Get Category Catalog Details Length
    [Arguments]   ${Len}   ${result}
    Run Keyword If  "${Len}" != "0"   Log  ${result.status_code}   
    ...   ELSE   Should Be Equal  ${result.status_code}  ${200}
    
Check Api Get Response Category Catalog Details
    [Arguments]   ${result}  ${File}
    Should Be Equal  ${result.json()["status"]}   ${True}
    Should Be Equal  ${result.json()["message"]}   success

Api Call For Update Category Catalog Details
    [Arguments]   ${File}  
    ${result}=  Put Request  CategoryCatalogDetails   /categoryCatalog  data=${File}
    [return]  ${result}

Check Api Update Response Category Catalog Details  
    [Arguments]   ${File}  ${result}
    Should Be Equal  ${result.json()["status"]}   ${True}
    Should Be Equal  ${result.json()["message"]}   success

Api Call For Delete Category Catalog Details
    [Arguments]   ${File}
    ${Object}=  Delete Request  CategoryCatalogDetails   /categoryCatalog?id=${File["category_id"]}
    [return]  ${Object}

Check Api Delete Response Category Catalog Details
    [Arguments]   ${File}   ${Object}
    Should be equal    ${Object.json()["status"]}    ${True}
    Should be equal    ${Object.json()["message"]}    success


*** Test Cases ***
Category Catalog: As an user, i can able to create Category Catalog Details and status (Post)
    [Tags]   Positive
    ${File}  Get File Data  CategoryCatalog.json
    ${Object}  Api Call For Create Category Catalog Details  ${File}
    Check Api Response Category Catalog Details  ${File}  ${Object}
    Validation Check Type Category Catalog Details  ${Object}
    ${lenkeys}  Get length for the File  ${File}
    
Category Catalog: As an user, i can able to Get Category Catalog Details and status (Get)
    [Tags]   Positive
    ${File}  Get File Data  CategoryCatalog_id.json
    ${result}  Api Call For Get Category Catalog Details  ${File}
    Check Api Get Response Category Catalog Details  ${result}  ${File}
    ${Len}  Get Length  ${result.json()["body"]}
    Check Get Category Catalog Details Length  ${Len}  ${result}
    
Category Catalog: As an user, i can able to Update Category Catalog Details and status (Update)
    [Tags]   Positive
    ${Object}  Get File Data  CategoryCatalog_id.json
    ${File}  Get File Data  CategoryCatalogs.json
    set to dictionary    ${File}    category_id=${Object['category_id']}
    ${result}  Api Call For Update Category Catalog Details  ${File}  
    Check Api Update Response Category Catalog Details  ${File}  ${result}

Category Catalog: As an user, i can able to Delete Category Catalog Details and status (Delete)
    [Tags]   Positive
    ${File}  Get File Data  CategoryCatalog_id.json
    ${Object}  Api Call For Delete Category Catalog Details  ${File}  
    Check Api Delete Response Category Catalog Details  ${File}  ${Object}




