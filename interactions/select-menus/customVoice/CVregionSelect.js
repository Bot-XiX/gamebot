/**
 * @file Select menu interaction: CVregionSelect
 * @since 1.0.0
*/
const { capitalize } = require('utils')
module.exports = {
  id: 'CVregionSelect',
  /**
  * @description Executes when the select menu with ID CVregionSelect is called.
  * @param {Object} interaction The Interaction Object of the command.
  */
  async execute (interaction) {
    if (interaction.values[0] === 'auto') {
      interaction.channel.edit({ rtcRegion: null })
      interaction.update({
        content: 'Die Region wurde auf `Automatisch` gesetzt!',
        components: [],
        ephemeral: true
      })
    } else {
      interaction.channel.setRTCRegion(interaction.values[0])
      let string = capitalize(interaction.values[0], true)
      switch (string) {
        case 'Uswest':
          string = 'US West'
          break
        case 'Uscentral':
          string = 'US Central'
          break
        case 'Ussouth':
          string = 'US South'
          break
        case 'Useast':
          string = 'US East'
          break
        case 'Southafrica':
          string = 'South Africa'
          break
        case 'Hongkong':
          string = 'Hong Kong'
          break
      }
      interaction.update({
        content: `Region auf \`${string}\` gesetzt!`,
        components: [],
        ephemeral: true
      })
    }
  }
}
