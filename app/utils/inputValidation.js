const usedFields = ['title','url','imageUrl','newsSite','summary','featured','launches','events']
const requiredFields = ['title','url','imageUrl','newsSite','summary','featured','launches','events']

const removeUnusedFields = (payload) => {
  const objKeys = Object.keys(payload)

  objKeys.forEach(f => {
    if(!usedFields.includes(f)){
      delete payload[f]
    }
  });
}

// Validate input for POST and PUT articles
const payloadHasErrors = (payload, updating) => {
  removeUnusedFields(payload)

  let fieldErrors = ''
  
  if(!updating){
    requiredFields.forEach(f => {
      if(payload[f] === undefined){
        fieldErrors += ` ${f} is missing;`
      }
    })
  }

  if(payload['launches'] != undefined){
    if(Array.isArray(payload['launches'])){
      // Validate objects inside the array
      const launchesError = validateJsonArray(payload, 'launches')
      fieldErrors = launchesError == null ? fieldErrors : `${fieldErrors}${launchesError}`
    }
  }

  if(payload['events'] != undefined){
    if(Array.isArray(payload['events'])){
      // Validate objects inside the array
      const eventsError = validateJsonArray(payload, 'events')
      fieldErrors = eventsError == null ? fieldErrors : `${fieldErrors}${eventsError}`
    }
  }

  if(fieldErrors){
    return `Errors:${fieldErrors}`
  }

  return null
}

// Arrays must have this format:
// [{"id": "someId", "provider": "someProvider"}, {"id": "someId", "provider": "someProvider"}]
const validateJsonArray = (payload, field) => {
  for(let i = 0; i < payload[field].length; i++){
    const l = payload[field][i]

    const keys = Object.keys(l)

    const errorMessage = ` ${field} must have 2 fields: "id" and "provider"`
    if(
      keys.length != 2 ||
      (!keys.includes('id') || !keys.includes('provider'))
    ){
      return `${errorMessage}`
    }
  }

  return null
}

module.exports = {
  removeUnusedFields,
  payloadHasErrors
}