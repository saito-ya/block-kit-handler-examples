import { App, ExpressReceiver } from '@slack/bolt';
import { Block } from '@slack/types';
import { Modal, context, plainText, section, divider, mrkdwnText, datepicker, option, staticSelect, input, plainTextInput, actions, button } from 'block-kit-handler';

// ------------------------
// Bolt App Initialization
// ------------------------
const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET ? process.env.SLACK_SIGNING_SECRET : ""
})

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver: receiver
});

// ------------------------
// Application Logic
// ------------------------
app.command("/message", async ({ ack, payload, context }) => {
    await ack();

    // declare blocks for message
    const blocks: Block[] = [
        section({ text: mrkdwnText('*Where should we order lunch from?* Poll by <fakeLink.toUser.com|Mark>')}),
        divider(),
        section({
            text: mrkdwnText(':sushi: *Ace Wasabi Rock-n-Roll Sushi Bar*\nThe best landlocked sushi restaurant.'),
            accessory: button(plainText('Vote'), 'vote-a', { value: 'click_me_123'})
        }),
        section({
            text: mrkdwnText(':hamburger: *Super Hungryman Hamburgers*\nOnly for the hungriest of the hungry.'),
            accessory: button(plainText('Vote'), 'vote-b', { value: 'click_me_123'})
        }),
        section({
            text: mrkdwnText(':ramen: *Kagawa-Ya Udon Noodle Shop*\nDo you like to shop for noodles? We have noodles.'),
            accessory: button(plainText('Vote'), 'vote-c', { value: 'click_me_123'})
        }),
        divider(),
        actions([ button(plainText('Add a suggestion'), 'add-suggestion', { value: 'click_me_123' })])
    ];

    // post message
    await app.client.chat.postMessage({
        token: context.botToken,
        channel: payload.channel_id,
        text: 'message sample',
        blocks: blocks
    });
});

app.command("/modal", async ({ ack, payload, context }) => {
    await ack();

    // declare blocks for modal
    const blocks: Block[] = [
        section({ text: mrkdwnText('*Hi <fakelink.toUser.com|@David>!* Here\'s how I can help you:')}),
        divider(),
        section({
            text: mrkdwnText(':calendar: *Create event*\nCreate a new event'),
            accessory: button(plainText('Create event'), 'create', { value: 'click_me_123', style: 'primary' })
        }),
        section({
            text: mrkdwnText(':clipboard: *List of events*\nChoose from different event lists'),
            accessory: staticSelect('chose-list', plainText('Choose list'), [
                option(plainText('My events'), 'value-0'),
                option(plainText('All events'), 'value-1'),
                option(plainText('Event invites'), 'value-2')
            ])
        }),
        section({
            text: mrkdwnText(':gear: *Settings*\nManage your notifications and team settings'),
            accessory: staticSelect('edit-settings', plainText('Edit settings'), [
                option(plainText('Notifications'), 'value-0'),
                option(plainText('Team settings'), 'value-1')
            ])
        }),
        actions([
            button(plainText('Send feedback'), 'send-feedback', { value: 'click_me_123' }),
            button(plainText('FAQs'), 'faqs', { value: 'click_me_123' })
        ]),
    ];

    // build modal
    const modal = new Modal(plainText('App menu'), blocks, { close: plainText('Cancel'), submit: plainText('Submit')});

    // open modal
    await app.client.views.open({
        token: context.botToken,
        trigger_id: payload.trigger_id,
        view: modal.getView()
    });
});



// Start app
(async () => {
    await app.start(process.env.PORT || 8080);
    console.log("⚡️ Bolt app is running!");
})();
