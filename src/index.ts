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
app.command("/message", async ({ ack, body, payload, context }) => {
    await ack();

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
    ]

    await app.client.chat.postMessage({
        token: context.botToken,
        channel: payload.channel_id,
        text: 'message sample',
        blocks: blocks
    });
});


// Start app
(async () => {
    await app.start(process.env.PORT || 8080);
    console.log("⚡️ Bolt app is running!");
})();
