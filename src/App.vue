<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'
import storage from 'store'
import { ACCESS_TOKEN, LOGIN_USER } from '@/store/mutation-types'
import store from './store'
import { getCasToken } from '@/api/login'

export default {
  data () {
    return {
      casLogin: false
    }
  },
  created () {
    this.checkCasStatus()
  },
  mounted () {
    window.callback = (result) => {
      console.log(result)
      if (result.success) {
        this.casLogin = true
        storage.set(ACCESS_TOKEN, result.message[0].token, 7 * 24 * 60 * 60 * 1000)
        storage.set(LOGIN_USER, result.message[0], 7 * 24 * 60 * 60 * 1000)
        if (this.$route.path === '/user/login') {
          this.$router.push({ path: '/' })
        }
      } else {
        this.casLogin = false
        store.dispatch('Logout')
      }
    }
  },
  methods: {
    checkCasStatus () {
      this.$jsonp('http://wol.bondex.com.cn/casclient/user.jsp', {}).then(result => {
        console.log(result)
      }).catch(err => {
        console.log(err)
      })

      setTimeout(() => {
        getCasToken(storage.get(ACCESS_TOKEN)).then(result => {
          if (!result.success) {
            store.dispatch('Logout')
          }
        }).catch((err) => {
          console.log(err)
          if (!this.casLogin) {
            store.dispatch('Logout')
          }
        })
      }, 1000)
    }
  },
  computed: {
    locale () {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      title && (setDocumentTitle(`${i18nRender(title)} - ${domTitle}`))

      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  }
}
</script>
