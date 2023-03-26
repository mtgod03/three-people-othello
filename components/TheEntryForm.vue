<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { VForm } from 'vuetify/components';

const emits = defineEmits<{
  (e: 'enter', room: string, playerName: string): void;
}>();

const { smAndUp } = useDisplay();

const entryForm = ref<VForm | null>(null);
const room = ref('');
const playerName = ref('');

const rules = {
  room: (value: string): boolean | string => {
    const pattern = /^\w{6,10}$/;
    if (!pattern.test(value)) {
      return '英数半角6~10文字で入力してください';
    }
    return true;
  },
  player: (value: string): boolean | string => {
    if (value.length === 0) {
      return 'プレイヤー名は必須です';
    }
    if (value.length > 8) {
      return '8文字以下で入力してください';
    }
    return true;
  },
} as const;

const enter = async (): Promise<void> => {
  const { valid } = await entryForm.value!.validate();
  if (valid) {
    emits('enter', room.value, playerName.value);
  }
};
</script>

<template>
  <v-card :width="smAndUp ? 400 : 300">
    <template v-slot:title>
      <span class="text-teal">ルームの作成・参加</span>
    </template>

    <template v-slot:text>
      <v-form ref="entryForm">
        <v-text-field
          v-model="room"
          class="my-2"
          label="ルーム名"
          hint="英数半角6~10文字"
          persistent-hint
          :rules="[rules.room]"
          color="teal"
          density="compact"
        ></v-text-field>

        <v-text-field
          v-model="playerName"
          class="my-2"
          label="プレイヤー名"
          hint="8文字以下"
          persistent-hint
          :rules="[rules.player]"
          color="teal"
          density="compact"
        ></v-text-field>
      </v-form>
    </template>

    <template v-slot:actions>
      <v-btn
        class="ml-auto"
        color="teal"
        @click="enter"
      >
        作成 / 参加
      </v-btn>
    </template>
  </v-card>
</template>
