<script setup lang="ts">
import PageHeader from '@/site/PageHeader.vue'
import BlockFrame from '@/site/BlockFrame.vue'
import Billing from '@/blocks/Billing.vue'
import Booking from '@/blocks/Booking.vue'
import Invite from '@/blocks/Invite.vue'
import Orders from '@/blocks/Orders.vue'
import Profile from '@/blocks/Profile.vue'
import QuickFind from '@/blocks/QuickFind.vue'
import Revenue from '@/blocks/Revenue.vue'
import SignIn from '@/blocks/SignIn.vue'
import billing from '@/blocks/Billing.vue?raw'
import booking from '@/blocks/Booking.vue?raw'
import invite from '@/blocks/Invite.vue?raw'
import orders from '@/blocks/Orders.vue?raw'
import profile from '@/blocks/Profile.vue?raw'
import quickFind from '@/blocks/QuickFind.vue?raw'
import revenue from '@/blocks/Revenue.vue?raw'
import signIn from '@/blocks/SignIn.vue?raw'
</script>

<template>
  <div class="flex flex-col">
    <PageHeader kicker="Blocks" title="Whole screens, ready to copy">
      Small, finished compositions built only from sui components. Each one is a single file: switch to Code and take it.
    </PageHeader>

    <div class="mx-auto grid w-full max-w-7xl items-start gap-x-8 gap-y-16 px-6 py-16 lg:grid-cols-2">
      <div class="lg:col-span-2"><BlockFrame name="Revenue" :source="revenue"><Revenue /></BlockFrame></div>
      <BlockFrame name="SignIn" :source="signIn"><SignIn /></BlockFrame>
      <BlockFrame name="Profile" :source="profile"><Profile /></BlockFrame>
      <BlockFrame name="Billing" :source="billing"><Billing /></BlockFrame>
      <BlockFrame name="Booking" :source="booking"><Booking /></BlockFrame>
      <div class="lg:col-span-2"><BlockFrame name="Orders" :source="orders"><Orders /></BlockFrame></div>
      <BlockFrame name="Invite" :source="invite"><Invite /></BlockFrame>
      <BlockFrame name="QuickFind" :source="quickFind"><QuickFind /></BlockFrame>
    </div>
  </div>
</template>
