<template>
  <u-footer class="border-t border-t-default">
    <template #bottom>
      <u-container>
        <u-footer-columns 
          :columns="[
            { 
              label: 'Support me',
              children: supports.map((p) => ({ label: p.name, to: p.url, target: '_blank', icon: p.icon.name, onClick: () => { umTrackEvent('cta-buy-me-a-coffee')} })) 
            },
        ]"
        />
      </u-container>
    </template>
    <template #right>
      <u-button 
        :href="s.url" 
        target="_blank" 
        v-for="s in socials ?? []" :title="s.name"
        :icon="s.icon.name"
        color="neutral"
        variant="ghost"
        @click="umTrackEvent(`cta-social-${s.name.toLocaleLowerCase}-footer`)"
      />
    </template>
  </u-footer>
</template>

<script lang="ts" setup>

const supports = [
  {
    name: "BuyMeACoffee",
    url: "https://buymeacoffee.com/tuxgonzalez",
    icon: {
        name: "simple-icons:buymeacoffee",
        url: "https://api.iconify.design/fluent-emoji-flat:buymeacoffe.svg"
    }
  }
];

const socials = [
  {
    name: "Github",
    url: "https://github.com/edgonzalez",
    icon: {
      name: "mdi:github",
      url: "https://api.iconify.design/mdi:github.svg"
    }
  },
  {
    name: "Twitter",
    url: "https://twitter.com/_tuxgonzalez",
    icon: {
      name: "mdi:twitter",
      url: "https://api.iconify.design/mdi:twitter.svg"
    }
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/edwin-gonz%C3%A1lez-54162618a/",
    icon: {
      name: "mdi:linkedin",
      url: "https://api.iconify.design/mdi:linkedin.svg"
    }
  },
    {
    name: "Email",
    url: "mailto:edgoca2498@gmail.com",
    icon: {
      name: "mdi:email",
      url: "https://api.iconify.design/mdi:email.svg"
    }
  },
];

</script>