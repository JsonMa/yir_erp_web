const queryMaterials = (keyword, callback) => {
  const defaultParams = {
    limit: 1000,
    offset: 0,
    embed: 'material',
    keyword
  }
  this.$axios
    .get('/materials', {
      params: Object.assign(defaultParams)
    })
    .then(res => {
      const {
        data
      } = res.data
      if (callback) callback(data)
    })
    .catch(() => {
      this.$message.error('原材料接口调用失败')
    })
}

const queryAccounts = (keyword, callback) => {
  const defaultParams = {
    limit: 1000,
    offset: 0,
    keyword
  }
  this.$axios
    .get('/accounts', {
      params: Object.assign(defaultParams)
    })
    .then(res => {
      const {
        data
      } = res.data
      if (callback) callback(data)
    })
    .catch(() => {
      this.$message.error('用户接口调用失败')
    })
}

export {
  queryMaterials,
  queryAccounts
}
