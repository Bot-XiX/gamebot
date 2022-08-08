const { EmbedBuilder } = require('discord.js')
const { getDatabase, set, ref, get } = require('firebase/database')
const prev = require('./config')

/**
 * @file Select menu interaction: roleconfig

 * @since 1.0.0
*/
module.exports = {
  id: 'roleconfig',
  /**
  * @description Executes when the select menu with ID roleconfig is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    const db = getDatabase()
    const id = interaction.guild.id
    function collect () {
      const msgFilter = (m) => m.author.id === interaction.member.id
      const msg = interaction.channel.awaitMessages({ filter: msgFilter, max: 1 })
      return msg
    }
    prev.prev.interaction.editReply({
      components: [prev.prev.configRow]
    })
    if (interaction.values.includes('adminrole')) {
      interaction.reply({
        content: 'Please mention the admin role.',
        ephemeral: true
      })
      await collect().then(async (m) => {
        await set(ref(db, id + '/roleconfig/roles/adminRole'), m.first().content.slice(2, -1))
        const adminRole = interaction.guild.roles.cache.get(`${JSON.stringify(await get(ref(db, id + '/roleconfig/roles/adminRole'))).slice(2, -1)}`)
        interaction.editReply({ content: `Admin role set to ${adminRole}` })
        m.first().delete()
      })
    }
    if (interaction.values.includes('modrole')) {
      interaction.reply({
        content: 'Please mention the mod role.',
        ephemeral: true
      })
      await collect().then(async (m) => {
        await set(ref(db, id + '/roleconfig/roles/modRole'), m.first().content.slice(2, -1))
        const modRole = interaction.guild.roles.cache.get(`${JSON.stringify(await get(ref(db, id + '/roleconfig/roles/modRole'))).slice(2, -1)}`)
        interaction.editReply({ content: `Mod role set to ${modRole}` })
        m.first().delete()
      })
    }
    const adminRole = interaction.guild.roles.cache.get(`${JSON.stringify(await get(ref(db, id + '/roleconfig/roles/adminRole'))).slice(2, -1)}`)
    const modRole = interaction.guild.roles.cache.get(`${JSON.stringify(await get(ref(db, id + '/roleconfig/roles/modRole'))).slice(2, -1)}`)
    // (db, id + '/tickets/config/')
    // (db, id + '/tickets/config/')
    // ###########################################
    const anonymEmbed = new EmbedBuilder()
      .setTitle('Role Einstellungen')
      .addFields(
        { name: 'Admin Rolle', value: String(adminRole) },
        { name: 'Mod Rolle', value: String(modRole) }
      )
    //! ###########################################
    prev.prev.interaction.editReply({ embeds: [anonymEmbed] })
  }
}
