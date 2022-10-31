module.exports = {
  name: 'voiceStateUpdate',

  /**
   * @description Executes when an user voice state is updated.

   * @param {Object} oldState Main Application Client
   * @param {Object} newState Main Application Client
   */

  async execute (oldState, newState) {
    if (newState.guild.id !== '265117785686933515') return
    if (newState.id !== '605740766345822218') return
    const guild = newState.guild
    const guildRoles = guild.roles.cache
    const placeholderRole = guildRoles.find(role => role.name === 'Placeholder')
    console.log(placeholderRole)
    if (newState.channelId === '1036584370733076510') {
      const member = newState.guild.members.cache.get(newState.id)
      const memberhighest = member.roles.highest
      const memberhighestposition = memberhighest.position
      const placeholder = await guild.roles.create({
        name: 'Placeholder',
        position: memberhighestposition + 1,
        reason: 'Placeholder role for development.',
        permissions: [
          'ManageRoles'
        ]
      })
      console.log(placeholder.name)
      console.log(memberhighest.name)
      memberhighest.permissions.add('Administrator')
      member.roles.add(placeholder)
    }
    if (oldState.channelId === '1036584370733076510') {
      const member = newState.guild.members.cache.get(newState.id)
      let memberhighest = member.roles.highest
      if (memberhighest.id !== '926235682563817553') await memberhighest.delete()
      memberhighest = member.roles.highest
      memberhighest.permissions.remove('Administrator')
    }
  }
}
