/**
 * Handle track event
 * @param  {SegmentTrackEvent} event
 * @param  {FunctionSettings} settings
 */
async function onTrack(event, settings) {
  //Set Default identity source if not supplied
  if (!settings.customIdentitySource) {
    settings.customIdentitySource = 'segment';
  }
  let memberSlug;

  //Find Slug by Segment User Id. A member must have already been created via an Identify call for the Track to work
  let endpoint =
    'https://app.orbit.love/api/v1/' +
    settings.orbitSlug +
    '/members/find?source=' +
    settings.customIdentitySource +
    '&username=' +
    event.userId;
  console.log('find slug endpoint: ' + endpoint);
  let getSlugResponse;
  try {
    getSlugResponse = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + settings.orbitApiKey,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // Retry on connection error
    throw new RetryError(error.message);
  }

  if (getSlugResponse.status >= 500 || getSlugResponse.status === 429) {
    // Retry on 5xx (server errors) and 429s (rate limits)
    throw new RetryError(`Failed with ${getSlugResponse.status}`);
  }
  let data = await getSlugResponse.json();
  console.log('get response: ' + JSON.stringify(data));
  if(!data.data.attributes.slug){
    throw new Error('Member slug not found.')
  }
  memberSlug = data.data.attributes.slug;
  console.log("memberslug: " + memberSlug);


  //Send Track Event

  //Check for activity mapping
  var activityTypeKey = null;
  if(settings.activityMapping[event.event]){
    activityTypeKey = settings.activityMapping[event.event]
  }

  endpoint =
    'https://app.orbit.love/api/v1/' + settings.orbitSlug + '/members/' + memberSlug + '/activities';
  console.log('endpoint: ' + endpoint);
  let response;
  let body = {
      activity: {
      title: event.event,
      key: event.messageId
      //activity_type: event.event
    }}
  //If Segment event name exists in the Activity Mapping, set the activity type key to what is mapped. Else, set Activity Type as Event Name
  if(activityTypeKey){
    body.activity.activity_type_key = activityTypeKey
  }else{
    body.activity.activity_type = event.event
  }
  //Add properties if addProperties setting is set to true
  if(settings.addProperties == true){
    body.activity.properties = {};
    body.activity.properties = event.properties
  }

  console.log('body' + JSON.stringify(body));
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + settings.orbitApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  } catch (error) {
    // Retry on connection error
    throw new RetryError(error.message);
  }

  if (response.status >= 500 || response.status === 429) {
    // Retry on 5xx (server errors) and 429s (rate limits)
    throw new RetryError(`Failed with ${response.status}`);
  }
  console.log(response.status);
  console.log(response.statusText);
}

/**
 * Handle identify event
 * @param  {SegmentIdentifyEvent} event
 * @param  {FunctionSettings} settings
 */
async function onIdentify(event, settings) {
  // Learn more at https://segment.com/docs/connections/spec/track/
  if (!settings.customIdentitySource) {
    settings.customIdentitySource = 'segment';
  }

  if(!event.traits.email&&!event.traits.name){
    throw new Error("No email or name exists in identify call.")
  }

  const endpoint =
    'https://app.orbit.love/api/v1/' + settings.orbitSlug + '/members';
  let response;
  let body = {
        member: {
        },
        identity: {
          source: settings.customIdentitySource,
          username: event.userId
        }
      }
      //populate Member object based on what is included in identify call
    if(event.traits.email){
      body.member.email =  event.traits.email
    }
    if(event.traits.name){
      body.member.name = event.traits.name
    }
  console.log("identify body: " + JSON.stringify(body))
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + settings.orbitApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  } catch (error) {
    // Retry on connection error
    throw new RetryError(error.message);
  }

  if (response.status >= 500 || response.status === 429) {
    // Retry on 5xx (server errors) and 429s (rate limits)
    throw new RetryError(`Failed with ${response.status}`);
  }

  console.log(response)
}

async function onPage(event, settings) {
  // Learn more at https://segment.com/docs/connections/spec/page/
  throw new EventNotSupported('page is not supported');
}

async function onGroup(event, settings) {
  // Learn more at https://segment.com/docs/connections/spec/group/
  throw new EventNotSupported('group is not supported');
}

/**
 * Handle page event
 * @param  {SegmentPageEvent} event
 * @param  {FunctionSettings} settings
 */
async function onPage(event, settings) {
  // Learn more at https://segment.com/docs/connections/spec/page/
  throw new EventNotSupported('page is not supported');
}

/**
 * Handle screen event
 * @param  {SegmentScreenEvent} event
 * @param  {FunctionSettings} settings
 */
async function onScreen(event, settings) {
  // Learn more at https://segment.com/docs/connections/spec/screen/
  throw new EventNotSupported('screen is not supported');
}

/**
 * Handle alias event
 * @param  {SegmentAliasEvent} event
 * @param  {FunctionSettings} settings
 */
async function onAlias(event, settings) {
  // Learn more at https://segment.com/docs/connections/spec/alias/
  throw new EventNotSupported('alias is not supported');
}

/**
 * Handle delete event
 * @param  {SegmentDeleteEvent} event
 * @param  {FunctionSettings} settings
 */
async function onDelete(event, settings) {
  // Learn more at https://segment.com/docs/partners/spec/#delete
  throw new EventNotSupported('delete is not supported');
}
