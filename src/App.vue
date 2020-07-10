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
    }
  },
  created () {
    this.checkCasStatus()
  },
  mounted () {
    window.callback = (result) => {
      if (result.success) {
        storage.set(ACCESS_TOKEN, result.message[0].token, 7 * 24 * 60 * 60 * 1000)
        storage.set(LOGIN_USER, result.message[0], 7 * 24 * 60 * 60 * 1000)
        this.$router.push({ path: '/' })
      } else {
        store.dispatch('Logout').then(() => {
          this.$router.push({ path: '/user/login' })
        })
      }
    }

    setTimeout(() => {
      getCasToken(storage.get(ACCESS_TOKEN)).then(result => {
        if (!result.success) {
          store.dispatch('Logout').then(() => {
            window.location.href = 'http://cas.bondex.com.cn:8080/login?service=' + window.location.origin + '/user/login'
          })
        }
      })
    }, 1000)
  },
  methods: {
    checkCasStatus () {
     this.$jsonp('https://wol.bondex.com.cn/casclient/user.jsp', {}).then(result => {
        console.log(result)
      }).catch(err => {
        console.log(err)
      })
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
