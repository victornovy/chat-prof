const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendPushMsg = functions.firestore
    .document('conversas/{conversaId}/msg/{msgId}')
    .onWrite((change, context) => {
        const conversaId = context.params.conversaId;
        const msgId = context.params.msgId;
        const data = change.after.data();
        console.log(conversaId, msgId);
        // 'c5yCjjoF9Ww:APA91bEVLBZVUIX9xGlYcfBLRdbvarucCAHpzKAPSs7P7CY3MOb-bxldsQUEMgGQqeoVFQs7bKN6Bj24WD78QQIjNkK1BZjHYCd_dhKUzX4RIxcFcpjrsCRVFh1Ha-ihDBJ2s2Fut59J',

        admin
            .messaging()
            .sendToCondition('testchannel1', {
                notification: {
                    title: data.autor,
                    body: data.texto
                }
            })
            .then(response => {
                console.log('Successfully sent message:', response);
            })
            .catch(error => {
                console.log('Error sending message:', error);
            });
    });
