import React, { useMemo, useState } from "react";
import {
  SafeAreaView, View, Text, ScrollView, TouchableOpacity, TextInput,
  Image, StyleSheet, Alert, StatusBar
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const C = {
  bg: "#09090F", panel: "#151521", panel2: "#1D1D2B",
  purple: "#9B7BFF", purple2: "#6D4AFF", text: "#F6F4FF",
  muted: "#A7A3B8", line: "#302D40", green: "#7ED6A5"
};

function Button({ title, onPress, secondary = false }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, secondary && styles.buttonSecondary]}>
      <Text style={[styles.buttonText, secondary && { color: C.text }]}>{title}</Text>
    </TouchableOpacity>
  );
}
function Card({ children }) { return <View style={styles.card}>{children}</View>; }
function SectionTitle({ children }) { return <Text style={styles.sectionTitle}>{children}</Text>; }

export default function App() {
  const [tab, setTab] = useState("Home");
  const [photo, setPhoto] = useState(null);
  const [skinType, setSkinType] = useState("Not sure yet");
  const [skinConcern, setSkinConcern] = useState("None selected");
  const [hairType, setHairType] = useState("Not sure yet");
  const [hairConcern, setHairConcern] = useState("None selected");
  const [budget, setBudget] = useState("₹500–₹1,000");
  const [notes, setNotes] = useState("");
  const [savedCheckins, setSavedCheckins] = useState([]);

  const routine = useMemo(() => {
    const skin = skinType === "Oily" ? "Use a gentle cleanser, lightweight non-comedogenic moisturiser and broad-spectrum SPF 30+." :
      skinType === "Dry" ? "Use a gentle cleanser, a richer fragrance-free moisturiser and broad-spectrum SPF 30+." :
      skinType === "Combination" ? "Use a gentle cleanser, lightweight moisturiser; add richer moisturiser only to dry areas, plus SPF 30+." :
      "Start with a gentle cleanser, simple moisturiser and broad-spectrum SPF 30+. Adjust after observing how your skin responds.";
    const hair = hairType === "Curly" || hairType === "Coily" ? "Use conditioner after washing, detangle gently and consider a leave-in product if needed." :
      hairType === "Wavy" ? "Use a gentle shampoo as needed, conditioner on lengths and a light styling product if desired." :
      hairType === "Straight" ? "Use a gentle shampoo as needed, conditioner on lengths and avoid heavy products if hair gets weighed down." :
      "Use a gentle shampoo and conditioner suited to your scalp and hair; observe oiliness, dryness and breakage.";
    return { skin, hair };
  }, [skinType, hairType]);

  async function choosePhoto(fromCamera) {
    try {
      const permission = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission needed", "Please allow camera or photo-library access to add a scan photo.");
        return;
      }
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.85 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.85 });
      if (!result.canceled && result.assets?.[0]?.uri) setPhoto(result.assets[0].uri);
    } catch (e) {
      Alert.alert("Unable to open photos", "Please try again.");
    }
  }

  function saveCheckin() {
    if (!photo) {
      Alert.alert("Add a photo first", "Take or choose a photo before saving a progress check-in.");
      return;
    }
    setSavedCheckins(prev => [{ uri: photo, date: new Date().toLocaleDateString() }, ...prev]);
    Alert.alert("Check-in saved", "Your photo has been added to this session's progress list. It is not uploaded.");
    setTab("Progress");
  }

  function choice(label, value, current, setter) {
    return (
      <TouchableOpacity key={value} onPress={() => setter(value)}
        style={[styles.choice, current === value && styles.choiceActive]}>
        <Text style={[styles.choiceText, current === value && { color: C.text }]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>MAXING <Text style={{ color: C.purple }}>OUT</Text></Text>
          <Text style={styles.tagline}>YOUR PERSONAL GROOMING COMPANION</Text>
        </View>
        <View style={styles.avatar}><Text style={{ color: C.purple, fontWeight: "800" }}>M</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tab === "Home" && <>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>WELCOME TO YOUR RESET</Text>
            <Text style={styles.heroTitle}>Build better{"\n"}habits. Feel your best.</Text>
            <Text style={styles.muted}>A personal space for skin, hair and grooming progress.</Text>
            <Button title="Start a scan  →" onPress={() => setTab("Scan")} />
          </View>
          <SectionTitle>Your areas</SectionTitle>
          <View style={styles.grid}>
            {[
              ["01", "SKIN", "Skin type & routine"],
              ["02", "JAWLINE", "Photo-based appearance review"],
              ["03", "HAIR", "Hair type & care"]
            ].map(([n, title, desc]) => <Card key={title} >
              <Text style={styles.cardNumber}>{n}</Text>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.muted}>{desc}</Text>
            </Card>)}
          </View>
          <Card>
            <Text style={styles.cardTitle}>Your analysis status</Text>
            <Text style={styles.muted}>No AI scores yet. MAXING OUT will not invent a score when an analysis has not been performed.</Text>
            <View style={styles.scoreRow}>
              {["Face", "Jawline", "Hair"].map(x => <View key={x} style={styles.scorePill}><Text style={styles.muted}>{x}</Text><Text style={styles.score}>—</Text></View>)}
            </View>
          </Card>
          <Text style={styles.footnote}>This starter version stores your choices only in the current app session. No photo is uploaded or analysed by AI yet.</Text>
        </>}

        {tab === "Scan" && <>
          <Text style={styles.pageTitle}>Your scan</Text>
          <Text style={styles.muted}>For consistent comparisons, use clear, evenly lit photos without filters or makeup. You can add front and side photos as the app develops.</Text>
          <Card>
            <Text style={styles.cardTitle}>Photo for review</Text>
            {photo ? <Image source={{ uri: photo }} style={styles.preview} /> :
              <View style={styles.photoPlaceholder}><Text style={{ fontSize: 34 }}>＋</Text><Text style={styles.muted}>No photo selected</Text></View>}
            <View style={styles.row}>
              <View style={{ flex: 1 }}><Button title="Take photo" onPress={() => choosePhoto(true)} /></View>
              <View style={{ flex: 1 }}><Button title="Choose photo" secondary onPress={() => choosePhoto(false)} /></View>
            </View>
            <Text style={styles.footnote}>Privacy note: this prototype keeps the selected photo on your device/session. Do not use it as a medical assessment.</Text>
          </Card>
          <SectionTitle>Tell us about your skin</SectionTitle>
          <Card>
            <Text style={styles.label}>How does your skin usually feel?</Text>
            <View style={styles.choices}>{["Dry", "Oily", "Combination", "Normal", "Sensitive", "Not sure yet"].map(v => choice(v, v, skinType, setSkinType))}</View>
            <Text style={styles.label}>Main skin concern</Text>
            <View style={styles.choices}>{["Dryness", "Oiliness", "Acne", "Redness", "Dark spots", "None selected"].map(v => choice(v, v, skinConcern, setSkinConcern))}</View>
          </Card>
          <SectionTitle>Tell us about your hair</SectionTitle>
          <Card>
            <Text style={styles.label}>Your hair texture</Text>
            <View style={styles.choices}>{["Straight", "Wavy", "Curly", "Coily", "Not sure yet"].map(v => choice(v, v, hairType, setHairType))}</View>
            <Text style={styles.label}>Main hair concern</Text>
            <View style={styles.choices}>{["Dryness", "Oily scalp", "Frizz", "Breakage", "Hair fall", "None selected"].map(v => choice(v, v, hairConcern, setHairConcern))}</View>
            <Text style={styles.label}>Monthly product budget</Text>
            <View style={styles.choices}>{["Under ₹500", "₹500–₹1,000", "₹1,000–₹2,000", "₹2,000+"].map(v => choice(v, v, budget, setBudget))}</View>
            <Text style={styles.label}>Anything else? (optional)</Text>
            <TextInput value={notes} onChangeText={setNotes} placeholder="E.g. sensitive to fragrance..." placeholderTextColor={C.muted} style={styles.input} multiline />
          </Card>
          <Button title="Save my profile & view routine" onPress={() => setTab("Routine")} />
          <Button title="Save photo as progress check-in" secondary onPress={saveCheckin} />
          <Text style={styles.footnote}>Important: skin type and hair type are self-reported in this prototype. Photo-based AI analysis is not connected yet.</Text>
        </>}

        {tab === "Routine" && <>
          <Text style={styles.pageTitle}>Your starter routine</Text>
          <Text style={styles.muted}>Based on the answers you selected. Keep it simple and stop any product that causes irritation.</Text>
          <Card>
            <Text style={styles.eyebrow}>SKINCARE</Text>
            <Text style={styles.cardTitle}>Morning</Text>
            <Text style={styles.bodyText}>1. Gentle cleanser (or rinse if appropriate).{"\n"}2. Moisturiser suited to your skin.{"\n"}3. Broad-spectrum SPF 30+ sunscreen.</Text>
            <Text style={styles.cardTitle}>Evening</Text>
            <Text style={styles.bodyText}>1. Gentle cleanser.{"\n"}2. Moisturiser.</Text>
            <Text style={styles.tip}>Your profile: {skinType} skin · Concern: {skinConcern}</Text>
            <Text style={styles.muted}>{routine.skin}</Text>
          </Card>
          <Card>
            <Text style={styles.eyebrow}>HAIRCARE</Text>
            <Text style={styles.cardTitle}>Your hair routine</Text>
            <Text style={styles.bodyText}>1. Wash based on scalp oiliness and activity.{"\n"}2. Apply conditioner mainly to hair lengths.{"\n"}3. Avoid excessive heat and tight hairstyles.</Text>
            <Text style={styles.tip}>Your profile: {hairType} hair · Concern: {hairConcern}</Text>
            <Text style={styles.muted}>{routine.hair}</Text>
          </Card>
          <Card>
            <Text style={styles.cardTitle}>Product budget</Text>
            <Text style={styles.bodyText}>{budget} per month</Text>
            <Text style={styles.muted}>Product matching and verified Indian product catalogue will be added in a later version. No brand or product is being endorsed yet.</Text>
          </Card>
        </>}

        {tab === "Progress" && <>
          <Text style={styles.pageTitle}>Your progress</Text>
          <Text style={styles.muted}>Track changes using photos taken in similar lighting, distance and angles.</Text>
          <Card>
            <Text style={styles.cardTitle}>Progress check-ins</Text>
            <Text style={styles.muted}>{savedCheckins.length} photo(s) saved in this session</Text>
            {savedCheckins.length === 0 ? <Text style={styles.empty}>No check-ins yet. Go to Scan and save your first photo.</Text> :
              savedCheckins.map((item, i) => <View key={i} style={styles.progressItem}>
                <Image source={{ uri: item.uri }} style={styles.thumb} />
                <View><Text style={styles.bodyText}>Check-in {savedCheckins.length - i}</Text><Text style={styles.muted}>{item.date}</Text></View>
              </View>)}
          </Card>
          <Text style={styles.footnote}>Photos and progress entries are temporary in this starter build and may disappear when the app restarts. Persistent private storage will be added before wider testing.</Text>
        </>}
      </ScrollView>

      <View style={styles.nav}>
        {["Home", "Scan", "Routine", "Progress"].map(item => (
          <TouchableOpacity key={item} onPress={() => setTab(item)} style={styles.navItem}>
            <Text style={[styles.navText, tab === item && styles.navTextActive]}>{item}</Text>
            {tab === item && <View style={styles.navDot} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderColor: C.line },
  brand: { color: C.text, fontSize: 22, fontWeight: "900", letterSpacing: 1.5 },
  tagline: { color: C.muted, fontSize: 8, letterSpacing: 1.6, marginTop: 3 },
  avatar: { width: 38, height: 38, borderRadius: 14, backgroundColor: C.panel2, alignItems: "center", justifyContent: "center" },
  content: { padding: 18, paddingBottom: 30, gap: 16 },
  hero: { padding: 22, backgroundColor: "#211B38", borderRadius: 22, borderWidth: 1, borderColor: "#44356F", gap: 12 },
  eyebrow: { color: C.purple, fontSize: 10, fontWeight: "800", letterSpacing: 1.8 },
  heroTitle: { color: C.text, fontSize: 31, fontWeight: "900", lineHeight: 36 },
  muted: { color: C.muted, fontSize: 13, lineHeight: 20 },
  pageTitle: { color: C.text, fontSize: 28, fontWeight: "900" },
  sectionTitle: { color: C.text, fontSize: 18, fontWeight: "800", marginTop: 3 },
  card: { backgroundColor: C.panel, borderRadius: 18, borderWidth: 1, borderColor: C.line, padding: 16, gap: 10 },
  cardNumber: { color: C.purple, fontSize: 11, fontWeight: "800" },
  cardTitle: { color: C.text, fontSize: 16, fontWeight: "800" },
  grid: { gap: 10 },
  scoreRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  scorePill: { flex: 1, padding: 10, borderRadius: 12, backgroundColor: C.panel2, gap: 4 },
  score: { color: C.text, fontSize: 24, fontWeight: "800" },
  button: { backgroundColor: C.purple2, paddingVertical: 13, paddingHorizontal: 15, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  buttonSecondary: { backgroundColor: C.panel2, borderWidth: 1, borderColor: C.line },
  buttonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  footnote: { color: "#817C96", fontSize: 11, lineHeight: 17 },
  photoPlaceholder: { height: 190, borderRadius: 14, backgroundColor: C.panel2, borderWidth: 1, borderColor: C.line, borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 8 },
  preview: { width: "100%", height: 260, borderRadius: 14, resizeMode: "cover" },
  row: { flexDirection: "row", gap: 9 },
  label: { color: C.text, fontSize: 13, fontWeight: "700", marginTop: 5 },
  choices: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  choice: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: 20, backgroundColor: C.panel2, borderWidth: 1, borderColor: C.line },
  choiceActive: { backgroundColor: "#49358B", borderColor: C.purple },
  choiceText: { color: C.muted, fontSize: 12, fontWeight: "600" },
  input: { minHeight: 75, borderRadius: 12, backgroundColor: C.panel2, borderColor: C.line, borderWidth: 1, color: C.text, padding: 12, textAlignVertical: "top" },
  bodyText: { color: C.text, fontSize: 13, lineHeight: 22 },
  tip: { color: C.purple, fontSize: 12, fontWeight: "700", marginTop: 4 },
  empty: { color: C.muted, fontSize: 13, paddingVertical: 18 },
  progressItem: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8, borderTopWidth: 1, borderColor: C.line },
  thumb: { width: 58, height: 58, borderRadius: 12, backgroundColor: C.panel2 },
  nav: { flexDirection: "row", backgroundColor: "#10101A", borderTopWidth: 1, borderColor: C.line, paddingTop: 10, paddingBottom: 9 },
  navItem: { flex: 1, alignItems: "center", gap: 5 },
  navText: { color: C.muted, fontSize: 11, fontWeight: "700" },
  navTextActive: { color: C.text },
  navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.purple }
});
