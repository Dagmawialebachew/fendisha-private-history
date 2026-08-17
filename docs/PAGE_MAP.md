# Page map — copy/paste friendly architecture

Each major scene is isolated in its own React file so a future revision can be done by replacing one file instead of untangling one giant app component.

| Order | File | Scene |
|---|---|---|
| Gate | `src/pages/01_EntryGatePage.js` | Glass-heart break + password |
| 02 | `src/pages/02_BirthdayRoomPage.js` | Birthday Room parallax |
| 03 | `src/pages/03_MoodChoicePage.js` | Choose a mood |
| 04 | `src/pages/04_BirthdayHeroPage.js` | Birthday-first hero |
| 05 | `src/pages/05_ThingsINoticePage.js` | Things Darion notices |
| 06 | `src/pages/06_OurMomentsPage.js` | Beginning / shared moments |
| 07 | `src/pages/07_CallsPage.js` | Calls / ordinary closeness |
| 08 | `src/pages/08_PlacesPage.js` | Addis memories |
| 09 | `src/pages/09_Feb13Page.js` | Feb 13 private memory |
| 10 | `src/pages/10_DistancePage.js` | Distance |
| 11 | `src/pages/11_FaithPage.js` | Kidane Mihret / faith |
| 12 | `src/pages/12_PastLivesPage.js` | Old-soul interlude |
| 13 | `src/pages/13_FuturePage.js` | Not-yet-photographed future |
| 14 | `src/pages/14_HerGiftPage.js` | Her gift to Darion callback |
| 15 | `src/pages/15_FinalePage.js` | 21st birthday finale |
| 16 | `src/pages/16_AfterwordPage.js` | Appendix / why it looks like her |
| 17 | `src/pages/17_ArtifactPage.js` | Artifact XXI / final physical reveal |

Shared pieces live under `src/components/`, state/storage/audio under `src/lib/`, and birthday copy/data under `src/content.js`.

## Future revision workflow
If a single scene needs a redesign, send that one page file plus any shared component it directly imports. The rest of the experience can remain untouched.
