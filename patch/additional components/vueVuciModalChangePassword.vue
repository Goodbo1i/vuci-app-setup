<template>
  <a-modal :closable="false" :keyboard="false" :maskClosable="false" v-model="visible" title="Change Password" on-ok="handleOk">
      <template slot="footer">
          <a-button key="submit" type="primary" @click="handleOk">
          Save
          </a-button>
      </template>
      <template>
          <a-form-model :model="form" :rules="rules" ref="form" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-form-model-item :label="$t('New password')" prop="password">
              <a-input-password v-model="form.password"/>
              </a-form-model-item>
              <a-form-model-item :label="$t('Confirm password')" prop="confirm">
              <a-input-password v-model="form.confirm"/>
              </a-form-model-item>
          </a-form-model>
      </template>
  </a-modal>
</template>
<script>
export default {
  props: {
    tempVis: Boolean
  },
  data: function () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('Please enter your password')))
      } else {
        if (this.form.confirm !== '') { this.$refs.form.validateField('confirm') }
        callback()
      }
    }
    const validatorConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('Please enter your password again')))
      } else if (value !== this.form.password) {
        callback(new Error(this.$t('Inconsistent input password twice!')))
      } else {
        callback()
      }
    }
    return {
      ModalText: 'Content of the modal',
      labelCol: { span: 10 },
      wrapperCol: { span: 10 },
      visible: this.tempVis,
      form: {
        password: '',
        confirm: ''
      },
      rules: {
        password: [{ validator: validatePass }],
        confirm: [{ validator: validatorConfirm }]
      }
    }
  },
  methods: {
    handleOk (e) {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.$rpc.call('ui', 'set_password', {
          username: this.$session.username(),
          password: this.form.password
        }).then(() => {
          this.$rpc.call('ui', 'first_set', {
            lang: 'en',
            username: this.$session.username(),
            password: this.form.password
          })
          this.$store.commit('changed', false)
          this.visible = false
        })
      })
    }
  }
}
</script>
