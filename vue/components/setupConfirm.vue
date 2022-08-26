<template>
  <div>
    <a-descriptions :title="$t('home.System information')" :column="1" bordered>
      <a-descriptions-item v-for="item in values" :key="item[0]" :label="item[0]">{{ item[1] }} </a-descriptions-item>
    </a-descriptions>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  props: ['updateValues'],
  data() {
    return {
      activeKey: ['1'],
      values: []
    }
  },
  methods: {
    async getOldData() {
      this.$store.state.netmask === '' ? (this.$store.state.netmask = this.$uci.get('network', 'lan', 'netmask')) : ''
      this.$store.state.ipaddr === '' ? (this.$store.state.ipaddr = this.$uci.get('network', 'lan', 'ipaddr')) : ''
      this.$store.state.zonename === '' ? (this.$store.state.zonename = this.$uci.get('system', 'system', 'zonename')) : ''

      this.values = [
        ['IP Address', this.$store.state.ipaddr],
        ['Netmask', this.$store.state.netmask],
        ['Zone name', this.$store.state.zonename],
        ['DHCP Start', this.$store.state.start],
        ['DHCP Limit', this.$store.state.limit],
        ['DHCP Leasetime', this.$store.state.leasetime],
        ['DHCP Disable', this.$store.state.ignore]
      ]
    }
  },
  watch: {
    updateValues(oldVal, newVal) {
      this.getOldData()
    }
  }
}
</script>

<style scoped>
.background {
  display: flex;
  align-items: center;
  height: 200px;
}

form {
  display: grid;
  justify-items: center;
  grid-template-columns: auto auto;
  gap: 1rem 1rem;
  width: 100%;
}

.left-align {
  justify-self: left;
}
.right-align {
  justify-self: right;
}
.center-align {
  justify-self: stretch;
}
.span-2 {
  grid-column: span 2;
}
.mr-3 {
  margin-right: 3rem;
}
.button {
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  border-radius: 10px;
  color: rgb(28, 53, 128);
  border: 1px solid rgb(15, 53, 165);
  transition: all 100ms ease-in;
}
.button:hover {
  background: rgb(28, 53, 128);
  color: white;
}
</style>
