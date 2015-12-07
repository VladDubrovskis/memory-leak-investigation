# Prerender DFP Ads

## Proof of Concept
The proof of concept works by making a single request for all ad slots on the server mocking the users user-agent, this call returns a JSON object combining details and HTML of each ad to be rendered into the page, in the demo this data is written into named script tags on the page which are then rendered into iframes on page load.

Currently no custom targeting is added but it's not a concern as all data currently used in targeting (e.g. cookies, referrer, user ip) is passed to the server.

## Reasons to do this
The initial reason for trying this was to prevent content jumping when an empty creative is returned from the server. But other more compelling reasons are:

Using Rubicon as a secondary ad supplier is causing additional latency and complexity on the client, the functionality would be better suited to the server where we have more control.

The issues with demographics targeting in a post cookie world could be resolved by calling an internal api from the server, with the push to API everything this could lead to interesting and powerful targeting options in the future.

Also other third party data suppliers such as Admantx are adding latency to the ad calls on the client, this latency could be shifted to the server and mitigated using caching or enrichment.

## The Problems

### Client side integration
Doing this without googles help may impact client side functionality, I'm not sure these ads will be tracked by active view or if we will be able to refresh ads on the client.

### Reporting
Because all requests to google will come from the same server impressions could be seen as duplicates or malicious by DFP affecting impression counting.

### Krux
Can we request a users Krux segments on the server, I don't know if this is possible and it maybe a new requirement for Krux which don't usually go well.

### Uncachable pages
One issue with this approach is it makes the page uncachable as the content is unique to each page view. I see some ways to avoid this issue:
AJAX - cache the response and have the browser make an ajax request for the ads.
Pros
- No impact to page size/load time
Cons
- Still potential for ads to cause content jumping while AJAX request completes

ESI - add the JSON to the page via an esi include
Pros
- Ad loading is as fast as possible
- Avoids content jumping
Cons
- Massive hit to page load time as ad responses will significantly increase initial request payload (2 simple ads would triple the initial page weight of next).
- Pages will have to wait for ad call to finish before the initial request is ready to serve

Hybrid - use esi to add some simple information about the ads to the initial DOM and ajax/http to return the ad creatives, the added content could be in the form of some classes added to the body that avoid content jumping and perhaps iframes that will load the creative (the creative html would be made available on the src URL for the iframe)
Pros
- Ad loading is as fast as possible
- Avoids content jumping
Cons
- Page requests have to wait for ad call to complete
- More complexity
Note on ESI: if data is being sent to the cdn compressed this will have to be disabled which will increase bandwidth use and could further detriment page load time.
