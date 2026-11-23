# MAXING OUT — MVP starter

This is the first clickable Android/iOS prototype for MAXING OUT.

## Included
- Dark premium dashboard
- Face/skin and hair self-report questionnaire
- Camera and gallery photo selection
- Starter skincare and haircare routines based on selected answers
- Session-only progress photo check-ins
- Clear placeholders where real AI analysis and verified product matching must be integrated

## Important limitations
- This is **not** a real AI face, skin, jawline, or hair analyser yet.
- No facial/skin/hair scores are generated. The app intentionally does not invent scores.
- The routine suggestions are basic educational starter guidance, not medical advice.
- Photos are selected locally and are not sent to a server in this prototype.
- Profile and progress data are held in app memory and are not persistent after restart.
- Before release, add secure storage, privacy/consent flows, deletion controls, backend security, model evaluation, and professional review of health-related guidance.

## Run locally
1. Install Node.js (LTS) on your computer.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Expo:
   ```bash
   npx expo start
   ```
4. Install **Expo Go** on your Android phone and scan the QR code shown by Expo while both devices are on the same network.

## Build an installable APK later
After testing and configuring an Expo/EAS account:
```bash
npx eas-cli build:configure
npx eas-cli build --platform android --profile preview
```
Add an `eas.json` with a preview profile using `"android": {"buildType": "apk"}` if you want a directly installable APK. Cloud builds may require an account and may have usage limits.

## Suggested next development milestone
Connect a real, validated analysis backend. For trustworthy results, skin type should combine questionnaire answers with image observations; visible photos alone cannot reliably diagnose conditions. Hair/scalp assessment also has limits from photos. Jawline feedback should describe visible profile/definition, not attractiveness or health.
