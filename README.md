# td

simple Twitch client with Discord Rich Presence support.

## What is this?

td is a very simple Electron client that lets you use [Twitch](https://www.twitch.tv/) and show the channel you're watching through [Discord](https://discordapp.com/) Rich Presence feature. It's still in development stages but sounds cool, right?

## Requirements

Basic electron stuff, mostly nodejs and npm.

## Testing

Clone repository and run ``npm install`` then ``npm start``. 

Tested on Windows 10 and Ubuntu 16.04 LTS, both with no serious issues.

## Disclaimer

None of this application is endorsed nor approved by neither Twitch nor Discord. Twitch and Discord are trademarks of their respective owners and their brand names are used only under fair use for information purposes.

## FAQ

### Are there any binaries available?

Work in progress (TM), for now you'll have to build the source.

### Any help accepted?

Yes! Feel free to submit a pull request if any cool feature comes up. Right now my priorities are:

* OSX support testing (high, help much appreciated)
* adding navigation features (high)
* adding most common streamers into the featured list (high, check next question)
* creating binary packages (high)
* multi language support (low)
* join button (very low as it requires Discord approval first)
* support for other services (Youtube Gaming mostly, very low)

Economic help is not asked yet (I might accept small tips as acknowledgement if you really want to show your support, but please contact me first through email). The best way to support this project is just by sharing it with your friends.

### Why some (really few streams) show picture and the rest only show the Twitch logo?

Sadly, Discord Rich Presence doesn't allow yet to upload pictures on the fly, and requires an image key for each picture. To showcase this functionality, some stream logos have been uploaded as assets on the Discord application, however, Discord limits this to 150 resources, so not all streams will make it into the application.

I'm open to hearing names that would be cool to fit in the application, the addition will be studied case by case, but mostly streamers I personally watch (this program is made for my personal use primarily) and large streamers (partnered, at least) can get inside. If you have such a name, email me (check my Github profile) or submit a pull request adding the name into the "featured" array (I still have to manually upload the asset).

For the rest of situations, if you _really_ want to see certain name, still feel free to ask, and if I reject your request (mostly due to space requirements), I recommend forking my project for your personal use and creating a new Discord application.

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
