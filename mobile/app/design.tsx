import { useState, type ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Archive, Feather, Heart, Moon, Sun, Wind, Plus, Trash2 } from "lucide-react-native";
import {
  ArticleCard, BreathingCircle, Button, Card, ChatBubble, Chip, ChoiceList, ConfirmSheet, EmptyState, IconButton,
  MediaTile, MilestoneBadge, MoodPicker, PanicButton, PlanCard, ProgressBar, Segmented, StreakCounter, Text,
  TextField, Toast, ToolCard, TypingIndicator, UrgeScale,
} from "@/components/ui";
import { useTheme } from "@/theme/ThemeProvider";
import { hex } from "@/theme/tokens";

/** Page de contrôle du design system. Hors navigation produit ; retirée du build de prod. */
export default function DesignSystem() {
  const insets = useSafeAreaInsets();
  const { theme, setPreference } = useTheme();
  const [mood, setMood] = useState<number | undefined>(2);
  const [urge, setUrge] = useState(7);
  const [who, setWho] = useState<string[]>(["them"]);
  const [triggers, setTriggers] = useState<string[]>(["night"]);
  const [tone, setTone] = useState<"gentle" | "tough">("gentle");
  const [plan, setPlan] = useState("yearly");
  const [draft, setDraft] = useState("I miss you. Can we talk?");
  const [fav, setFav] = useState(true);
  const [sheet, setSheet] = useState(false);

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 120 }}>
      <View className="w-full max-w-content self-center gap-8 px-gutter">
        <View className="flex-row items-center justify-between">
          <View>
            <Text variant="2xl">Design system</Text>
            <Text variant="sm" tone="muted">No Contact · theme {theme}</Text>
          </View>
          <IconButton
            icon={theme === "dark" ? Sun : Moon}
            label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            onPress={() => setPreference(theme === "dark" ? "light" : "dark")}
          />
        </View>

        <Section title="Colour roles">
          <View className="flex-row flex-wrap gap-2">
            {Object.keys(hex.dark).map((k) => (
              <View key={k} className="w-[31%] gap-1">
                <View className="h-10 rounded-sm border border-border" style={{ backgroundColor: hex[theme][k as keyof typeof hex.dark] }} />
                <Text variant="xs" tone="muted">{k}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Type">
          <Text variant="display">Display 40</Text>
          <Text variant="2xl">Heading 28</Text>
          <Text variant="xl">Title 22</Text>
          <Text variant="lg">Subtitle 18</Text>
          <Text variant="base">Body 16 — you are doing something hard, one day at a time.</Text>
          <Text variant="sm" tone="muted">Small 14, muted</Text>
          <Text variant="xs" tone="subtle">Caption 12, subtle</Text>
        </Section>

        <Section title="Streak counter">
          <View className="items-center"><StreakCounter days={23} goalDays={60} /></View>
          <StreakCounter days={23} goalDays={60} size="compact" />
          <View className="flex-row justify-between">
            {[1, 3, 7, 14, 30].map((d) => <MilestoneBadge key={d} days={d} earned={d <= 23} />)}
          </View>
        </Section>

        <Section title="Panic">
          <PanicButton variant="hero" onPress={() => {}} />
          <View className="items-end"><PanicButton onPress={() => {}} /></View>
          <View className="items-center"><BreathingCircle pattern="breath-calm" size={200} /></View>
        </Section>

        <Section title="Check-in">
          <MoodPicker value={mood} onChange={setMood} />
          <UrgeScale value={urge} onChange={setUrge} />
          <View className="flex-row flex-wrap gap-2">
            {["night", "alone", "a song", "their story", "a place", "drinks"].map((t) => (
              <Chip key={t} label={t} selected={triggers.includes(t)}
                onPress={() => setTriggers(triggers.includes(t) ? triggers.filter((x) => x !== t) : [...triggers, t])} />
            ))}
          </View>
        </Section>

        <Section title="Onboarding question">
          <ProgressBar value={0.4} label="Step 2 of 5" />
          <Text variant="xl">Who ended it?</Text>
          <ChoiceList
            label="Who ended it?"
            value={who}
            onChange={setWho}
            options={[
              { value: "me", label: "I did" },
              { value: "them", label: "They did" },
              { value: "mutual", label: "We both did" },
              { value: "unclear", label: "It's complicated", hint: "On and off, or it just faded" },
            ]}
          />
        </Section>

        <Section title="Buttons">
          <Button label="Start my no contact" full />
          <View className="flex-row flex-wrap gap-2">
            <Button label="Secondary" variant="secondary" />
            <Button label="Ghost" variant="ghost" />
            <Button label="Delete" variant="danger" icon={Trash2} />
          </View>
          <View className="flex-row flex-wrap gap-2">
            <Button label="Saving" loading />
            <Button label="Disabled" disabled />
            <Button label="Small" size="sm" icon={Plus} />
          </View>
        </Section>

        <Section title="Fields">
          <TextField label="Write it here instead" value={draft} onChangeText={setDraft} multiline maxLength={500} helper="Nothing leaves your phone." />
          <TextField label="Nickname for them" value="" placeholder="Optional" error="Keep it under 30 characters" />
        </Section>

        <Section title="Coach">
          <Segmented label="Coach tone" value={tone} onChange={setTone}
            options={[{ value: "gentle", label: "Gentle" }, { value: "tough", label: "Straight talk" }]} />
          <ChatBubble role="system" text="Coach, not a therapist. In danger? Get help now." />
          <ChatBubble role="user" text="It's 2am and I want to text them." />
          <ChatBubble role="coach" text="Thanks for coming here first. What would you want the text to get you?" />
          <TypingIndicator />
          <ChatBubble role="user" text="I miss you. Can we talk?" status="not-sent" skin="bubbly" />
        </Section>

        <Section title="Vault">
          <View className="flex-row gap-2">
            <MediaTile type="screenshot" caption="The 'you're too much' text" />
            <MediaTile type="voice" durationLabel="0:42" />
            <MediaTile type="photo" />
          </View>
          <EmptyState icon={Archive} title="Nothing saved yet" body="Keep the screenshots and notes that remind you why it ended." action={<Button label="Add a reminder" size="sm" icon={Plus} />} />
        </Section>

        <Section title="Toolkit & learn">
          <ToolCard title="Slow exhale" meta="Calm · 2 min" icon={Wind} favorite={fav} onToggleFavorite={() => setFav(!fav)} />
          <ToolCard title="Body scan" meta="Release · 6 min" icon={Feather} locked onToggleFavorite={() => {}} />
          <ArticleCard tag="Why it hurts" title="Your brain treats a breakup like withdrawal" minutes={4} />
        </Section>

        <Section title="Paywall">
          {[
            { id: "weekly", title: "Weekly", price: "$—", sub: "Billed every week" },
            { id: "yearly", title: "Yearly", price: "$—", sub: "7-day free trial, then yearly", badge: "Best value" },
          ].map((p) => <PlanCard key={p.id} {...p} selected={plan === p.id} onPress={() => setPlan(p.id)} />)}
        </Section>

        <Section title="Feedback">
          <Toast message="Check-in saved. Day 23 counts." />
          <Toast tone="danger" message="You're offline. We'll sync when you're back." />
          <Button label="Open reset sheet" variant="secondary" icon={Heart} onPress={() => setSheet(true)} />
        </Section>

        <Card><Text variant="sm" tone="muted">Prices are placeholders. Copy is draft, written fresh.</Text></Card>
      </View>

      <ConfirmSheet
        visible={sheet}
        title="Restart your count?"
        body="Your 23 days stay in your history. Slipping is part of it — what matters is the next day."
        confirmLabel="Restart from today"
        onConfirm={() => setSheet(false)}
        onCancel={() => setSheet(false)}
      />
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <Text variant="xs" tone="subtle" className="uppercase tracking-widest">{title}</Text>
      <View className="gap-3">{children}</View>
    </View>
  );
}
