# td

Twitch client with Discord Rich Presence support.

## Current Status (28-12-2020)

Apparently Discord RPC has now been deprecated in favor of GameSDK. Moreover, RPC scopes are now whitelist only, so we cannot
authenticate.

Therefore, this seed is currently failing to show the current Rich Presence status due to the changes made to Discord APIs.

I am working on integrating the new SDK (which seems not to be whitelist only), but I cannot provide a deadline yet.

It is implemented already, but the SDK initialization returns me "false" so I will keep investigating whenever I have time for it.

Feel free to use this project as a seed for integrating the current SDKs. Here's the reference material:

* [Rich Presence](https://discord.com/developers/docs/rich-presence/best-practices)
* [Discord GameSDK for Electron](https://github.com/open-unlight/node-discord-game)

If you manage to fix this issue, feel free to open a pull request.

## What is this?

td is a client that lets you use [Twitch](https://www.twitch.tv/) and show the channel you're watching through [Discord](https://discordapp.com/) Rich Presence feature. It's still in development stages but sounds cool, right?

## Requirements

Basic electron stuff, mostly nodejs and npm.

## Testing

Clone repository and run ``npm install`` then ``npm start``. 

Visual Studio Build Tools and Python 3 are required for building on Windows.

Tested on Windows 10 and Ubuntu 16.04 LTS, both with no serious compatibility issues. *I need help for macOS testing!*

## Disclaimer

None of this application is endorsed nor approved by neither Twitch nor Discord. Twitch and Discord are trademarks of their respective owners and their brand names are used only under fair use for information purposes.

## Acknowledgements

Huge shoutout to [Kyle](https://github.com/Racsr) who has been helping a lot with the testing and Santa's list of features.

## FAQ

### Are there any binaries available?

Yes, check the [releases page](https://github.com/marcsances/td/releases) and be warned it's pre-release yet.

### Any help accepted?

Yes! Feel free to submit a [pull request](https://github.com/marcsances/td/pulls) or issue if any cool feature comes up. You can check the [open issues](https://github.com/marcsances/td/issues) and open one for yourself.

Economic help is not asked yet (I might accept small tips as acknowledgement if you really want to show your support, but please contact me first through email). The best way to support this project is just by sharing it with your friends.

### I have a problem!

First check if there's already an [open issue](https://github.com/marcsances/td/issues) for your problem. If there's none, submit an issue and attach your logs (log.txt on the application folder). Make sure to screen out the logs for sensititive information, as this file will be public. If you don't feel confident of publishing the logs or they contain sensitive information, send them to my personal email (check my Github profile). When reporting the issue, be as much detailed as you can on the steps to reproduce the issue, and also add your OS version. This will help me track down the problem. You can also fix it for yourself, if you're brave enough, and submit a pull request.

### Why some (really few streams) show picture and the rest only show the Twitch logo?

Sadly, Discord Rich Presence doesn't allow yet to upload pictures on the fly, and requires an image key for each picture. To showcase this functionality, some stream logos have been uploaded as assets on the Discord application, however, Discord limits this to 150 resources, so not all streams will make it into the application.

I'm open to hearing names that would be cool to fit in the application, the addition will be studied case by case, but mostly streamers I personally watch (this program is made for my personal use primarily) and large streamers (partnered, at least) can get inside. If you have such a name, email me (check my Github profile) or submit a pull request adding the name into the "featured" array (I still have to manually upload the asset).

For the rest of situations, if you _really_ want to see certain name, still feel free to ask, and if I reject your request (mostly due to space requirements), I recommend forking my project for your personal use and creating a new Discord application.

### What is this? New emotes? New weird badges? Host button? Did you code all this?

No. [BetterTTV](https://nightdev.com/betterttv/) and [FrankerFaceZ](https://www.frankerfacez.com/) userscripts are integrated with Td from factory. I'll add an option to unload them on the settings (and also add custom userscripts), but it's not yet ready. If you dislike any of either (or want to add more), remove them from the ``userscripts`` variable. To add your own script, add a link to your script CDN. _Userscript link is not enough!_ Td does not recognize userscripts. Usually userscripts are just a bootstrapper that injects the actual script from an URL, so open the userscript and find such URL.

### Why this isn't yet a feature on (Discord/Twitch/X)?

``¯\_(ツ)_/¯``

I do like this feature as it allows streamers get more visibility through your own Discord profile.

## License

Copyright 2018, Marc Sances

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
