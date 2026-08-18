YOO — I went back through the **latest version of the actual experience**, not the early ZIP plan.

The site has changed enough that the old voice guide needed a real rewrite. The current emotional flow now runs from Room → Mood → Birthday → Notice → Moments → Calls → Places → Feb 13 → Distance → Faith → Past Lives → Future → Her Gift → Finale → Afterword → Artifact. 

And after looking at it, **I would still keep exactly 6 main voice notes. Do not add voice to every page.** The Entry experience already teaches her to scroll/tap/hold/use sound, so the opening doesn't need to become another tutorial.  The Room already communicates tons through details like Mercedes, Begena, etc., so narration there would compete with exploration.  Most importantly, the Finale now deliberately finishes the cake interaction and then says **“hear the part that actually matters”** before playing `media.voiceFinal`. 

So: **six voices, strategically placed.** Keep the existing filenames so we don't need to touch code.

# FINAL VOICE GUIDE — AUGUST 18 VERSION

Put all six in:

```text
public/media/voice/
```

Do **not** try to sound cinematic. Phone mic. Quiet room. Talk to *her*. If you laugh, breathe, restart a sentence, say “wait wait 😭” — keep it.

Also, our latest soundtrack system already pauses Spotify when a voice note starts and resumes it afterward, so these voices get their own clean moment. 

---

## `01-opening.mp3`

**Target: 20–35 sec**

This has changed the most because now she has already survived the whole mysterious countdown/door bullshit 😭.

Record roughly:

> yoo… fkr 😭
>
> so u actually got in.
>
> after all that fighting with the damn door… happy birthday, yene Fendisha. 💜
>
> I’m not gonna explain what this is because… well, u waited this long already 😂
>
> just don’t rush through it, eshi? headphones dergish if u have them… and just go through everything normally.
>
> some things are serious, some things are very stupid 😭… but almost everything here has a reason.
>
> okay… welcome, fkr.
>
> I made this for u.

### Recording note

Smile when you say:

> “after all that fighting with the damn door…”

Because **she actually did fight with it all night** 😂. That makes the pre-birthday teaser suddenly feel connected to the real experience.

Don't explain controls. The website already does that.

---

# `02-calls.mp3`

**Target: 30–45 sec**

This should play like you're remembering something rather than explaining the Calls page.

> bro… our calls were actually ridiculous 😭
>
> like Ethio Telecom would literally say “okay that’s enough of u two,” cut the call after two hours…
>
> and then what did we do?
>
> call again. 😂
>
> and the funny thing is, sometimes I genuinely don’t even remember what the hell we talked about for that long.
>
> sometimes it was something serious, sometimes u were singing, sometimes we were just saying complete nonsense…
>
> but I think that’s what I liked about it.
>
> it became normal just… having u there. hearing your voice.
>
> and there are days where I really miss that kind of normal, fkr.

### Important

That final line should get quieter.

> “I really miss that kind of normal, fkr.”

No dramatic music-voice. Just say it.

And the singing reference now makes more sense because music has become a recurring thread across the whole site.

---

# `03-distance.mp3`

**Target: 50–75 sec**

This is **not an apology recording**. The Distance page is honesty in the middle of a birthday experience.

Start naturally:

> fkr… okay.
>
> this one is a little harder for me to say properly.
>
> I think one thing I understand better now is… when something is going on with me, or I’m tired mentally, or I just need space… I go quiet.
>
> and inside *my* head, being quiet doesn’t automatically mean anything changed. it doesn’t mean I stopped caring about u. it doesn’t mean I suddenly stopped loving u.
>
> gn… u don’t live inside my head.
>
> u only know what I actually show u.
>
> and if what I show u is silence… then obviously that’s all u have to understand me with.
>
> [small pause]
>
> I think I’m still learning how to say… “fkr, I need a little space rn, but we’re okay,” instead of disappearing into my own head and expecting u to somehow know that.
>
> I don’t want this to turn into some huge apology section on your birthday 😭 that’s not why it’s here.
>
> I just wanted this whole thing to be honest about us too.
>
> we’ve had close us… far us… easy us… difficult us.
>
> and even when I’m quiet, it doesn’t make u unimportant to me.
>
> [pause]
>
> and rn…
>
> I miss u, fkr.

**Stop.**

Do not add another sentence after “I miss u, fkr.”

---

# `04-faith.mp3`

**Target: 90 sec–2 min**

This is the one I would **not script too aggressively**.

Use this as a path. Tell it from memory.

Start:

> fkr… there’s something I never really knew how to explain properly about this whole thing.
>
> when u told me about that guy who saw u at church… and that whole marriage situation…
>
> obviously part of me was scared.
>
> like… I love this girl. I don’t wanna lose her.
>
> but then there was another thought that was bothering me even more.
>
> I kept thinking… what if I’m holding onto u just because *I’m* scared to lose u?
>
> what if there is something genuinely good for your life and I become selfish just because I want u for myself?
>
> and I really didn’t want my love for u to become that.

Pause.

Then:

> I talked to friends about it… and they gave me their thoughts and everything.
>
> gn I still wasn’t settled inside.
>
> I remember going to ቅዳሴ…
>
> and at some point I stopped trying to calculate everything myself.
>
> I don’t remember making some huge complicated prayer.
>
> the thing that was in my heart was basically…
>
> **“if she is for me… keep her.”**

**Pause properly here.**

Then:

> that was it.
>
> not “give her to me no matter what.”
> not “prove something to me.”
>
> just… if she is for me, keep her.
>
> and if not… then I didn’t want fear to make me stand in the way of something God knows better than me.
>
> [pause]
>
> I’m not saying this like I know exactly what God has planned for me and u. I don’t.
>
> I don’t know exactly where every part of our future goes.
>
> but I remember that prayer.
>
> and I remember how real that moment felt to me.
>
> so when I think about us and faith… that’s one of the moments I think about.
>
> and today… on your 21st birthday…
>
> I’m just grateful that you’re still here, fkr.

End there.

### Very important

No joke at the end.

Give the audio **2–3 seconds of silence** before stopping the recording.

This is one of the emotional anchors of the whole site.

---

# `05-future.mp3`

**Target: 50–75 sec**

The old version leaned a little too much into “our future.”

The new site is better because the Future page should also be about **her becoming herself**.

> okay… future 😭
>
> I don’t know exactly what our future looks like.
>
> and I’m not gonna fake some perfect certainty just because it’s your birthday.
>
> gn when I think about my future… u show up in it a lot.
>
> I think about more random days with u… more places… more stupid conversations… more normal life.
>
> maybe one day marriage, family, all those things we’ve talked about… if life takes us there.
>
> but I also think about **you**.
>
> not just you as my girlfriend or somebody’s future wife or whatever.
>
> you.
>
> your faith… your confidence… the things u wanna do… your work, your dreams, the woman u wanna become.
>
> I wanna see u win at things that belong completely to u.
>
> I wanna see u become more confident, more peaceful, more capable… more *you*.
>
> and if I’m beside u while that happens, I wanna be somebody who adds something good to your life. not somebody who makes your world smaller.
>
> somebody u feel safe with… supported by… loved by.
>
> [small pause]
>
> and yes… unfortunately I’m probably also going to have to hear about your Mercedes approximately seven hundred times 😭
>
> but yeah…
>
> I wanna see more life with u, fkr.

The Mercedes joke is perfect **here** because it breaks the seriousness right before the end, and that future detail already exists elsewhere in the experience rather than appearing randomly. 

---

# `06-final-birthday.mp3`

**Target: 3–5 minutes**

## THIS IS THE ONE.

By the time she hears this:

she has seen the room, herself at 21, the little things you notice, memories, insane calls, your places, Feb 13 😭, distance, faith, old-soul stuff, future, her gift to you, **the versions of herself you never knew**, and then she has literally blown out the birthday cake.

The current Finale intentionally makes this recording **“the part that actually matters.”** 

So do **not** summarize the website.

Talk to her.

I'd record roughly this:

> fkr…
>
> okay.
>
> if u’re hearing this then u actually reached the end of this whole thing 😭
>
> which is crazy because apparently I built u an entire digital country just to say happy birthday.
>
> [laugh]
>
> but… happy 21st birthday, yene Fendisha.
>
> seriously.
>
> happy birthday.
>
> [pause]
>
> I’ve said a lot of things in here already… but there are some things I wanted u to hear from *me*. not text on a screen, not some narrator, not some stupid button.
>
> just me.
>
> one thing about u that I don’t think I say enough is how wholeheartedly u love.
>
> when u love somebody… u really love them.
>
> I feel it in the way u worry about me… the way u check on me… the way u support me… the way u can somehow make me feel special over very small things.
>
> and especially the way u’ve supported my dreams.
>
> u know I have a million ideas going around in my head all the time 😭 and somehow u still listen to them… encourage me… believe in me… even when half the time I’m probably talking like a mad man.
>
> and I don’t take that lightly.
>
> [pause]
>
> u also make me comfortable in a way that is hard for me to explain.
>
> like I can talk to u for two hours… the network literally forces us to stop… and then somehow we call again 😂
>
> and sometimes we weren’t even saying anything important.
>
> just having u there felt good.
>
> [small laugh]
>
> and then there’s your laugh.
>
> bro 😭
>
> I don’t even know how “Fendisha” became such a serious name in my head.
>
> from outside it probably sounds so stupid 😂
>
> but when I say **My Fendisha**… I know exactly who I mean.
>
> your laugh… the way u make *me* laugh… that whole stupid energy u have sometimes…
>
> somehow that name became *you* to me.
>
> [pause]
>
> and seeing all those old photos of u while making this was actually weird.
>
> because there were all these versions of u that existed before I knew u.
>
> little u… younger u… all those different versions…
>
> each one had a whole life already happening.
>
> u had birthdays, problems, dreams, people u loved, things u were scared of… all of that…
>
> and somewhere else I was just living my own completely separate life with absolutely no idea u existed.
>
> then eventually our lives crossed.
>
> and somehow **this** is the version of u I got lucky enough to know.
>
> twenty-one-year-old u.
>
> [pause]
>
> and I hope u understand something…
>
> when I say I want to see who u become, I don’t mean because who u are now isn't enough.
>
> I love who u are now.
>
> I just know there is still so much life ahead of u.
>
> and I genuinely want good things for that girl.
>
> I want u closer to God.
>
> I want peace in your mind.
>
> I want u healthy.
>
> I want u confident.
>
> I want u to succeed at things that matter to *you*.
>
> I want u surrounded by people who genuinely love u.
>
> I want u to have moments where u stop and think… damn, I prayed for this once.
>
> and yes 😭 I want u to eventually have your stupid beautiful Mercedes so I can finally hear the end of it.
>
> [laugh]
>
> I just… want good things for u, fkr.
>
> not only good things for *us*.
>
> good things for **you**.
>
> [pause]
>
> and there’s something else.
>
> u know when u made that birthday website for me…
>
> I genuinely loved that.
>
> not because it was a website.
>
> I can build websites 😭 that’s not the point.
>
> it was because u sat there and collected pieces of us.
>
> things we said… memories… little stupid things… and made something out of them for me.
>
> and I don’t think I properly told u how much I loved the fact that u put that kind of effort into remembering us.
>
> so technically…
>
> [laugh]
>
> **this whole thing might be your fault.**
>
> u started it.
>
> [pause]
>
> me and u haven’t only existed in one version either.
>
> there’s easy us.
>
> laughing us.
>
> singing us.
>
> walking around Addis us.
>
> those ridiculous phone-call us.
>
> there’s romantic us…
>
> there’s whatever-the-hell-February-13-was us 😭
>
> [actually laugh]
>
> there’s far us.
>
> there’s misunderstanding us.
>
> quiet us.
>
> there’s the version where I’m in Gondar and I miss u.
>
> there’s us trying to understand each other.
>
> and there’s even praying us.
>
> [pause]
>
> we haven’t been perfect.
>
> I haven’t been perfect.
>
> and I’m sure there are still things both of us are gonna have to learn.
>
> I don’t know exactly what every chapter after this looks like.
>
> and I don’t want to stand here on your birthday making promises about things only God knows.
>
> but after the easy us…
>
> the difficult us…
>
> the close us…
>
> the far us…
>
> the laughing us…
>
> the praying us…
>
> after all of that…
>
> [PAUSE]
>
> **fkr… I still choose you.**
>
> [long pause]
>
> and today I’m just really grateful that somewhere in this huge world… I met u.
>
> I'm grateful that I know your face when you’re happy…
>
> and unfortunately your face when you’re mad too 😭
>
> which… I still think is very cute, even though saying that while you’re actually mad is usually a terrible decision.
>
> [laugh]
>
> I’m grateful I know your voice.
>
> your laugh.
>
> your heart.
>
> your weird little interests.
>
> your faith.
>
> and this version of u.
>
> [pause]
>
> so…
>
> happy 21st birthday, yene fkr.
>
> happy birthday, My Fendisha.
>
> afekrshalew. ❤️
>
> and please… never become too serious to laugh the way u laugh now.
>
> **lafendadash ende 😂❤️**
>
> happy birthday, fkr.

And then **leave 4–5 seconds of silence before stopping the recording.**

Don't say “bye.”

Don't say “that's all.”

Don't explain anything.

Let your breathing be the last thing she hears.

---

# One thing I would NOT do anymore

I would **not add** separate voice notes to Room, Things I Notice, Moments, Places, Feb 13, Past Lives, Her Gift, Afterword, etc.

Earlier I was tempted to give you 15–19 voice clips. Looking at the finished architecture now, that would make your voice ordinary.

We want her to reach a page and think:

**“oh… Darion is talking to me now.”**

not:

**“another audio button.”**

These six have clear jobs:

**Opening** → *I’m finally inside.*
**Calls** → *I remember our ordinary closeness.*
**Distance** → *he understands something about us.*
**Faith** → *this mattered to him more deeply than I knew.*
**Future** → *he sees me as my own person in his future.*
**Finale** → *everything was leading here.*

And because the soundtrack automatically gets out of the way while your voice plays, your actual recordings become the moments where the entire polished website basically shuts up and lets **you** take over. 

**Record the final one last.** Do Calls first to loosen yourself up, then Opening, Distance, Future, Faith, and only then Final. By Final, you should no longer feel like you're “recording content.” You should feel like you're sending her a voice note.
