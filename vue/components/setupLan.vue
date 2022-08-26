<template>
  <div>
    <a-collapse v-model="activeKey">
      <a-collapse-panel key="1" header="LAN Configuration">
        <div class="background">
          <vuci-form uci-config="network" key=".index" @>
            <vuci-named-section :name="'lan'" v-slot="{ s }" :card="false">
              <vuci-form-item-input @change="setIP" label="IP address" :uci-section="s" name="ipaddr" rules="ip4addr" />
              <vuci-form-item-input @change="setNet" label="Netmask" :uci-section="s" name="netmask" rules="ip4addr" />
            </vuci-named-section>
            <template #footer> <span /></template>
          </vuci-form>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="DHCP Configuaration">
        <vuci-form uci-config="dhcp">
          <vuci-named-section name="lan" v-slot="{ s }" :card="false">
            <vuci-form-item-dummy :uci-section="s" label="Interface" name="interface" />
            <vuci-form-item-switch @change="setIgnore" :uci-section="s" label="Disable interface" name="ignore" />
            <vuci-form-item-input @change="setStart" :uci-section="s" label="Start" name="start" placeholder="100" rules="uinteger" />
            <vuci-form-item-input @change="setLimit" :uci-section="s" label="Limit" name="limit" placeholder="150" rules="uinteger" />
            <vuci-form-item-input @change="setLease" :uci-section="s" label="Leasetime" name="leasetime" placeholder="12h" :rules="validateLeasetime" />
          </vuci-named-section>
          <template #footer> <span /></template>
        </vuci-form>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
import VuciNamedSection from '../../components/VuciForm/src/VuciNamedSection.vue'
/* eslint space-before-function-paren: ["error", "never"] */

export default {
  // computed: {
  //  ipAddress() {
  //    return this.$store.state.ipaddr
  //  }
  // },
  components: { VuciNamedSection },
  props: ['testProp'],
  data() {
    return {
      activeKey: ['1']
    }
  },
  methods: {
    setIP(self) {
      this.$store.state.ipaddr = self.model
    },
    setNet(self) {
      this.$store.state.netmask = self.model
    },
    setIgnore(self) {
      console.log(self)
      self.model === true ? (this.$store.state.ignore = self.trueValue) : (this.$store.state.ignore = self.falseValue)
    },
    setStart(self) {
      this.$store.state.start = self.model
    },
    setLimit(self) {
      this.$store.state.limit = self.model
    },
    setLease(self) {
      this.$store.state.leasetime = self.model
    },
    apply() {
      if (this.$store.state.netmask !== String) {
        this.$uci.set('network', 'lan', 'netmask', this.$store.state.netmask)
      }
      if (this.$store.state.ipaddr !== String) {
        this.$uci.set('network', 'lan', 'ipaddr', this.$store.state.ipaddr)
      }
      this.$uci.set('dhcp', 'lan', 'start', this.$store.state.start)
      this.$uci.set('dhcp', 'lan', 'limit', this.$store.state.limit)
      this.$uci.set('dhcp', 'lan', 'leasetime', this.$store.state.leasetime)
      this.$uci.set('dhcp', 'lan', 'ignore', this.$store.state.ignore)

      this.$uci.save().then(() => {
        this.$uci.apply()
      })
      this.$system.initRestart('dnsmasq')
      this.$router.push({ path: '/' })
    },
    validateLeasetime(v) {
      if (v === '') return

      if (v === '1m') return this.$t('dhcp.minimum is 2 minutes (2m).')

      if (/^\d+h$|m$/.test(v)) return

      return this.$t('Invalid format. Correct format: "12h" or "30m"')
    }
  },
  watch: {
    testProp(newVal, oldVal) {
      this.apply()
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
  justify-items: auth;
  grid-template-columns: auto auto;
  gap: 2rem 1rem;
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
