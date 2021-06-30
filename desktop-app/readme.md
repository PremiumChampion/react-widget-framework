# Configuration for your new electronjs app

1. Edit the name of your product in [package.json](./package.json) and the title of the [index.html](/src/index.html):
 
    ``` JSON
    {
        "name": "YOUR_APP_NAME",
        "productName": "YOUR_APP_PRODUCT_NAME"
    }
    ```

    ``` HTML
    <head>
        <title>YOUR_APP_NAME</title>
    </head>
    ```

2. Edit Description of your project in [package.json](./package.json):

    

    ``` JSON
    {
        "description": "YOUR_APP_DESCRIPTION"
    }
    ```

3. Add author information to your project in the [package.json](./package.json):

    

    ``` JSON
    {
    "author": {

        "name": "YOUR_NAME",
        "email": "YOUR_EMAIL"
        }
    }
    ```

4. Select youre license [(List of licenses)](https://spdx.org/licenses/):

    

    ``` JSON
    {
        "license": "YOUR_SELECTED_LICENSE"
    }
    ```

5. Set your app icon:

    ``` JSON
    {
    "config": {

        "forge": {
            "packagerConfig": {
                "icon": "THE_PATH_TO_YOUR_APP_ICON"
            }
        }
    }
    ``` 

6. Start writing your code:

    1. Set electron configuration in [index.ts](/src/index.ts).

        **IMPORTANT: Do not turn on webSecurity when running `npm run production` , `npm run make` or `npm run publish` , as it will result in not showing your selected HTML-Site.**

    2. To run code in WebContext use [renderer.ts](/src/renderer.ts).

    3. Change the contents of the [index.html](/src/index.html) according to your needs.

7. You can add packages according to your needs with `npm i --save YOUR_PACKAGE_NAME` or if its a developement-tool with `npm i --save-dev YOUR_PACKAGE_NAME` .
