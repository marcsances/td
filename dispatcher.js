/*
td - Twitch client with Discord RPC support
Copyright 2018, Marc Sances

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var logger = require('electron-log');

const sysurls = ['directory','dashboard'];
const featured = ['summit1g','the8bitdrummer','sethdrumstv','lvpes','halifax','ninja','racsrr'];

function dispatchUrl(url) {
    var matchRegex = /https?:\/\/(?:www.)?twitch.tv\/([^\\\/\?\n]+)?(?:\?.*)?(?:\/([^\\\?\/\n]+))?(?:\?.*)?(?:\/([^\\\?\/\n]+))?/gi;
    var res = matchRegex.exec(url);
    logger.debug("Matches: " + res)
    if (res.length > 0) {
        this.smallImageKey = "twitch";
        this.smallImageText = "Twitch";
        this.details = "Twitch";
        switch (res[1]) {
            case undefined:
                this.state = "Home";
                this.largeImageKey = "glitchy";
                this.largeImageText = this.state;
                break;
            case "directory":
                this.state = "Directory (" + (res[2] != undefined ? (res[2] == "following" ? "following" : res[3]) : "home") + ")";
                this.largeImageKey = "glitchy";
                this.largeImageText = this.state;
                break;
            case "settings":
                this.state = "Managing settings";
                this.largeImageKey = "glitchy";
                this.largeImageText = "Settings";
                break;
            case "friends":
                this.state = "Friends";
                this.largeImageKey = "glitchy";
                this.largeImageText = this.state;
                break;
            case "messages":
                this.state = "Messages";
                this.largeImageKey = "glitchy";
                this.largeImageText = this.state;
                break;
            case "subscriptions":
                this.state = "Managing subscriptions";
                this.largeImageKey = "glitchy";
                this.largeImageText = "Subscriptions";
                break;
            case "inventory":
                this.state = "Managing inventory";
                this.largeImageKey = "glitchy";
                this.largeImageText = "Inventory";
                break;
            case "payments":
                this.state = "Managing payment methods";
                this.largeImageKey = "glitchy";
                this.largeImageText = "Payments";
                break;
            case "jobs":
                this.state = "Looking for a job";
                this.largeImageKey = "glitchy";
                this.largeImageText = "Jobs";
                break;
            case "p":
                switch (res[2]) {
                    case "about":
                        this.state = "About page";
                        this.largeImageKey = "glitchy";
                        this.largeImageText = "About";
                        break;
                    case "cookie-policy":
                        this.state = "Reading cookie policy";
                        this.largeImageKey = "glitchy";
                        this.largeImageText = "Cookies";
                        break;
                    case "partners":
                        this.state = "Partnership page";
                        this.largeImageKey = "glitchy";
                        this.largeImageText = "Partners";
                        break;
                    case "press":
                        this.state = "Press page";
                        this.largeImageKey = "glitchy";
                        this.largeImageText = "Press";
                        break;
                    case "privacy-policy":
                        this.state = "Privacy policy";
                        this.largeImageKey = "glitchy";
                        this.largeImageText = "Privacy policy";
                        break;
                    case "terms-of-service":
                        this.state = "Reading TOS";
                        this.largeImageKey = "glitchy";
                        this.largeImageText = "Terms of Service";
                        break;
                    default:
                        this.state = res[2];
                        this.largeImageKey = "glitchy";
                        this.largeImageText = res[2];
                }
                break;
            default:
                if (res[2] == "dashboard") {
                    this.state = "Channnel Dasboard";
                    this.largeImageKey = "glitchy";
                    this.largeImageText = res[1];
                } else if (res[2] == "manager") {
                    this.state = "Video Manager";
                    this.largeImageKey = "glitchy";
                    this.largeImageText = res[1];
                } else {
                    if (featured.indexOf(res[1]) != -1) {
                        this.largeImageKey = res[1];
                    } else {
                        this.largeImageKey = "glitchy";
                    }
                    this.state = "Watching " + res[1];
                    this.largeImageText = res[1];
                }
                break;
        }
    } else {
        this.details = "Twitch";
        this.state = "Unknown Location";
        this.largeImageKey = "glitchy";
        this.largeImageText = "Unknown Location";
        this.smallImageKey = "twitch";
        this.smallImageText = "Unknown Location";
    }
    return this;
}

module.exports = { dispatchUrl: dispatchUrl };