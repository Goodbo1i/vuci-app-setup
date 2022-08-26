<template>
  <div>
    <div class="background">
      <form method="POST" @submit.prevent="updateTime">
        <div class="right-align">
          <label for="current"> Current system time </label>
        </div>
        <div class="left-align">
          <span
            ><b>{{ localTime }}</b></span
          >
          <button type="button" class="button" @click="syncTime" role="button" style="margin: 0 1rem">SYNC WITH BROWSER</button>
        </div>
        <div class="right-align">
          <label for="timezone">Select Timezone</label>
        </div>
        <select class="left-align" name="timezone" @change="selectTimezone($event.target.value)">
          <option v-for="(zone, index) in $zoneinfo" :key="zone[0]" :value="index" :selected="zoneName == zone[0]">{{ zone[0] }}</option>
        </select>
      </form>
    </div>
  </div>
</template>

<script>
/* eslint space-before-function-paren: ["error", "never"] */

export default {
  props: ['testProp'],
  data() {
    return {
      activeKey: ['1'],
      timezone: 'loading...',
      zoneName: '',
      initialZone: '',
      localTime: ''
    }
  },
  methods: {
    async updateTime() {
      this.$store.commit('spin', 'Setting system time')
      await this.$uci.load('system')
      this.$uci.set('system', 'system', 'timezone', this.timezone)
      this.$uci.set('system', 'system', 'zonename', this.zoneName)
      this.$uci.save().then(() => {
        this.$store.commit('spin', 'Applying timezone configuration changes')
        this.$uci.apply().then(() => {
          setTimeout(() => {
            this.initialZone = this.zoneName
            this.getTime()
            this.$store.commit('spin', false)
            this.$store.commit('spin', false)
          }, 1000)
        })
      })
    },
    syncTime() {
      const currentTime = Math.floor(Date.now() / 1000)
      this.$rpc.call('system', 'time', { time: currentTime }).then((res) => {
        this.localTime = new Date(res.time * 1000).toLocaleString('lt-LT', { timeZone: this.initialZone })
      })
    },
    selectTimezone(i) {
      this.timezone = this.$zoneinfo[i][1]
      this.zoneName = this.$zoneinfo[i][0]
      this.$store.state.zonename = this.zoneName
    },
    getTime() {
      this.$rpc.call('system', 'time').then((response) => {
        this.localTime = new Date(response.time * 1000).toLocaleString('lt-LT', { timeZone: this.initialZone })
      })
    }
  },
  watch: {
    testProp(newVal, oldVal) {
      this.updateTime()
    }
  },
  created() {
    this.$uci.load('system').then((res) => {
      this.timezone = this.$uci.get('system', 'system', 'timezone')
      this.zoneName = this.$uci.get('system', 'system', 'zonename')
      this.initialZone = this.zoneName
      this.getTime()
    })
    setInterval(() => {
      this.getTime()
    }, 5000)
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
