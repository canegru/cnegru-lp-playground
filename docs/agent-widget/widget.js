$(document).ready(function () {

    const notificationCallback = (data) => {
        console.log('notificationHandler called with data');
        console.log(data);
    };
    const visitorFocusedCallback = (data) => {
        console.log('notificationHandler called with data');
        console.log(data);
    };
    const visitorBlurredCallback = (data) => {
        console.log('notificationHandler called with data');
        console.log(data);
    };

    const notifyWhenDone = (data) => console.log(data);

    lpTag.agentSDK.init({
        notificationCallback,
        visitorFocusedCallback,
        visitorBlurredCallback
    });

    $("#openWidget").click(function (e) {
        var { cmdNames: { writeSC } } = lpTag.agentSDK; // = "Write ChatLine"
        var data = {
            json: {
                "type": "vertical",
                "elements": [
                    {
                        "type": "button",
                        "tooltip": "button tooltip",
                        "title": "Open Widget",
                        "click": {
                            "actions": [
                                {
                                    "type": "link",
                                    "name": "liveperson",
                                    "uri": "https://static-assets.dev.fs.liveperson.com/tmo/development/catalintest/widget/sideCar/clientWidget.html",
                                    "target": "slideout"
                                }
                            ]
                        }
                    }
                ]
            }

        };
        lpTag.agentSDK.command(writeSC, data, notifyWhenDone);
    });
    $("#sendData").click((e) => {
        const { cmdNames: { writeSC } } = lpTag.agentSDK; // = "Write ChatLine"
        const dataToPass = {
            id: '5f63be0ff493c305becfa004',
            username: 'bob',
        }
        var data = {
            json: {

                "type": "vertical",
                "elements": [
                    {
                        "type": "text",
                        "text": "When clicking this button below, it will execute js oncode via javascript:lpSCWidget.login()",
                        "tooltip": "Please authenticate by clicking the login button below.",
                        "rtl": false,
                        "style": {
                            "bold": true,
                            "italic": false,
                            "color": "#000000"
                        }
                    },
                    {
                        "type": "button",
                        "tooltip": "LoginDialog",
                        "title": "Execute window.dataPasser",
                        "click": {
                            "metadata": [
                                { "type": "ExternalId", "id": "running364" }
                            ],
                            "actions": [
                                {
                                    "type": "link",
                                    "name": "Execute window.dataPasser",
                                    "uri": `javascript:window.dataPasser('${dataToPass.username}','${dataToPass.id}');`,
                                    "target": "self"
                                }
                            ]
                        }
                    }
                ]
            }

        };
        console.log("data", data)
        lpTag.agentSDK.command(writeSC, data, notifyWhenDone);
    });

});