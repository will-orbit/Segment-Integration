
# Segment Function for Orbit

This project allows sending new Activities and Members to Orbit via a Segment Function (https://segment.com/product/connections/functions/).

## Setup

1. Create a new Destination Function in Segment by going to Connections --> Catalog --> Functions
2. Copy and Paste the code in segment.js in the code editor
3. In the right-hand panel of the Code Editor, select "Settings" and add the following variables:

Label         | Type          | Required?     
------------- | ------------- | -------------
orbitSlug  | String  | Yes
orbitApiKey  | String  | Yes
activityMapping | Map | No
customIdentitySource | String | No

4. Click "Configure" then name and create your Segment Destination
5. Connection this new Destination to the relevant Segment Source
6. Set up Destination Filters for this Destination so only Identify Calls and your relevant Track Events are sent to this destination
7. Configure the Variables for this destination as follows:

### Variable Config 
**orbitSlug**

This is the slug of your Orbit Workspace. When logged into your workspace, the slug can be found in the URL: https://app.orbit.love/[WORKSPACE SLUG]

**orbitApiKey**

Choose either a workspace-wide API Key in Workspace Settings --> API Tokens or a personal API Key in Account Settings --> API Tokens

**activityMapping**

By default, Events in Segment will be mapped to an Activity Type in Orbit with the same name. For example, an "Order Completed" event in Segment will create or map to an activity type in Orbit with the name "Order Completed". If you would like to map Events in Segment to a different "Activity Type Key" in Orbit, use this object. The Key of each variable should match an Event Name in Segment and the value should match the Activity Type Key in Orbit.

**customIdentitySource**

By default, this function will create a Custom Identity Source for your members in Orbit titled "segment". If you would like to change this identity source, use this variable.

## How this function works
### Identify
For each Identify call that comes into the Segment Source, a member will be created/updated in your Orbit Workspace. If successful, a new identity will be added to the Orbit Member with the Segment User ID as the value for "username" on the Orbit Identity. Along with the Identity, email and name will be added to the Member as long as those fields are present within the Identity call as traits.

 Name or Email is required. If neither email or name exist as a trait within the Identify call, nothing will be sent to Orbit. 

:warning: An Identify call for a user must be sent to Orbit before any activities will be added to that member. If a Track call comes into Segment for a user that has not yet been added as an Identity in Orbit, the function will be aborted. This is because Orbit must have at least a name or email address for each Member. Without an Identify call, this cannot be ensured.

### Track
Each Track call will create an Activity in Orbit. 

Field mapping is as follows:
Segment Track Property         | Orbit Activity Field | Notes     
------------- | ------------- | -------------
Event Name  | Activity Title  | 
Event Name  | Activity Type  | Unless the "activityMapping" setting is configued.
messageId | Activity Key | This will prevent duplicate activities from being created if the same Track Event is seen multiple times in Segment

:warning: It is highly recommend to use Destination Filters in Segment to limit which activities are created in Orbit. Too many activity types in Orbit will create noise and make Orbit harder to use
