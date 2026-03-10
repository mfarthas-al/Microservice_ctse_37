IT22208262
Responsibilities

Create new events with event details.

Retrieve available events for users.

Update existing event information.

Delete events when required.

Provide event information to other services such as the Booking Service.

Event Information Stored

The Event Service stores and manages the following event details:

Event ID

Event Name

Event Description

Event Date and Time

Event Location

Event Capacity

Ticket Price

Interaction with Other Services

The Booking Service retrieves event details from the Event Service to verify event availability before confirming a booking.

The Event Service provides event data required for booking validation and event listing in the frontend.

Workflow

An administrator creates an event through the frontend application.

The frontend sends the event creation request to the Event Service.

The Event Service processes the request and saves the event data in the database.

The stored event information becomes available for users to view and book through the system.

The Booking Service accesses event information when users attempt to book an event.