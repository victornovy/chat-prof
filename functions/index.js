const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendPushMsg = functions.firestore
    .document('conversas/{conversaId}/msg/{msgId}')
    .onWrite((change, context) => {
        const conversaId = context.params.conversaId;
        const msgId = context.params.msgId;
        const data = change.after.data();

        console.log(
            `### CvId: ${conversaId} | MsgId: ${msgId} | ToTopic: ${
                data.channel
            } | title: ${data.autor} | body: ${data.texto}`
        );

        return admin
            .messaging()
            .sendToTopic(
                `${data.channel}`,
                {
                    notification: {
                        title: data.autor,
                        body: data.texto
                    },
                    data: { conversaId, msgId }
                },
                {
                    contentAvailable: true
                }
            )
            .then(resp => {
                console.log('send to topic: ', resp);
            })
            .catch(err => {
                console.log('Error sending message:', err);
            });
    });
