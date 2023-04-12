
<div align="center">

<h1> Microsoft Imagine Cup </h1>

<h2> Team Sudarshan </h2>

<h3> Run for earth </h3>

</div>



# Welcome! 
Welcome to this document describing our submission for Microsoft Imagine Cup.

We have many things to discuess but first let us tell you somthing about yourselves.

# The Team


## Kshitiz Agrawal

Hi, I am Kshitiz Agrawal a Computer Science student passionate about building systems that scale and I am too a student in VIT Bhopal. I have skills under Backend Development, Web Development and Mobile Development and mostly work under the JavaScript/TypeScript ecosystem. My most frequently used technologies are NodeJS, ReactJS and React Native.

Here are few links where you can find me
- [GitHub](https://github.com/Kshitiz1403)

We met through a common class on campus, our friendship bloomed through discussing about unique technologies and solving LeetCode problems together.


Some formal details
- University: VIT Bhopal
- Major: Computer Science
- Year: 3rd Year

Contact Information:
- Email: kshitizagrawal@outlook.com
- Contact Number: xxxxx xxxxx

## Pratham Powar

Hi, I am Pratham Powar the author of this document and a psycho coder currently studying in VIT Bhopal. I have skills in system programming, compiler development and backend development. I use Golang and Python most of the time. I am also a very loyal Linux enthusiast with experience in using and building software for Linux for the last few years.

Here are few links where you can find me
- [GitHub](https://github.com/pspiagicw)
- [Blog](https://blog.pspiagicw.xyz)

Some formal details
- University: VIT Bhopal
- Major: Computer Science
- Year: 3rd Year


Contact Information:
- Email: pspiagicw@gmail.com
- Contact Number: xxxxx xxxxx


# The Idea

Our idea comes from our daily routine of going out for jogging. We obviously notice the fact that our streets are littered. 

From a little research we came to know about `plogging`. A physical excercise where you walk while picking up littered garbage.

We are introducing a app to manage and track any person's plogging adventures. We also plan monetary benefit for a person's effort.

Presenting our app `Sudarshan`.

# Sudarshan

A feature-rich and easy to use application for managing your eco-walks. Get monetary rewards and benefits for helping the environment.

This app will help you walk while collecting any littered garbage. It will guide to dispose that garbage at pre-determined locations on your route. We provide options to the user customizing his/her walk depending on the distance and the total time taken. 

For detecting if the user has disposed of the garbage, we are implementing a hardware component we can attach to any dustbin. This hardware implementation is 100% offline and works with minimal power, enough to be powered with a battery.

We plan to partner with govenments and ecological NGO's to provide monetary benefits.


# Target Audience

We are targetting a general audience with physical capability to walk and perform general excercise. But we aim to specially motivate a few groups of people

- Fitness Enthusiasts: Fitness geeks would love to contribute to the environment while improving their health. By the right marketing these could be some of our first customers.

- NGO's and Ecological Organizations: These organizations may use our application to conduct group eco-walks. By configuring our app into a group-mode, we can track group data and provide additional benefits while you help the environment with our friends and peers.


# Personas

We can assume a few personas who might  be some of our users.

##  A student

The most relatable persona is of a student like us. This daily walk might be due to physical fitness or for a daily chore. But in any case, he can configure his walk in our app. Then our app will provide him a few routes according to the dustbins available in the area. The student chooses a single dustbin and then procedes to collect the garbage. He reaches the dustbin and the dustbin provides a kind of one-time QR Code on it's module. Which the app can scan to confirm how much garbage has been put and whether the QR is being generated from the right location.

After doing a few walks he can observe that
- He gets monetary benefit and avails a coupon for a new tech product. This coupon is thanks to your sponsor.
- When he scans the health of the dustbin is communicated to our servers. Our contractors will respond accordingly.

## A working professional

A young working professional has very little time to worry about their health. They plan to walk regularly to maintain their fitness and improve their lifestyle. They use our app to plan their routes and gain monetary benefits. They can avail a coupon to ease their daily commute through our app. Some important things to note

- They may invite their friends on free-days and have a combined walk.
- They are contributing to the environment without going out their way in their busy lifestyle.
- They obviously maintain health without investing in fitness equipment and gym memberships.

# The working

Our app and it's backend is built on a TypeScript ecosystem. Some highlights are
- The app is built using React Native
- The backend uses ExpressJS.
- The app uses Microsoft Email Communication for User Verification and informing our user's about our app.
- The app also uses Microsoft Blob Storage to store raw data, mostly data about our users.

The frontend written in React Native communicates with our backend hosted on Azure servers. Where are hosting our MongoDB databases as well. The hosting of the backend and database are not currently implemented but are planned.

The database contains data on the prelocated and stored dustbins. Our system chooses the dustbins that are on the path whenever a user selects the destination.
The user may then choose which trash can they wish to empty the waste into.

In order to reroute the user through the choosen trashcan we create the path between the user and the destination using Google's direction API. Users may search for the specified place using Google's autocomplete API.

Our pricey APIs, such as the routes API and the autocomplete API, have rate limites utilizing Redis to stop API abuse.

The hardware side is interesting and includes writing the source code in Arduino C.

The hardware includes
- Arduino Mega v3
- An SR04 ultrasonic distance sensor.
- An SSD1306 OLED Screen to display the QR Code.
- An 10-20KG weight sensor.

The hardware side is written in C and uses common libraries to interact with the hardware components using Analog pins on the board.

The QR on the screen is refreshed every 30 seconds because of the TOTP based verifcation algorithm we are using. 

We transmit information like
- Dustbin ID (Unique for every Dustbin)
- Weight difference
- TOTP ( The unique time based OTP created when weight is added or removed).

All of this is transmitted through a JWT token whose key is the unique OTP we are generating using TOTP. 

You can see the working [here](https://wokwi.com/projects/353810754233892865).This is a working simulation of how the hardware would be working in the end.

On the server side we are using the dustbin id to fetch the hash used to generate the TOTP.
We use a standard TOTP library to generate a OTP at that specific timestamp (at which the dustbin generated the TOTP), and use it to verify the sigature of the token.

Because we are flashing each module with it's unique id and it's unique hash (which is base32 string) used for generating TOTP, and it' s memory is READ ONLY, the OTP cannot be tampered with to be exploited.

This ensures a offline working of our dustbin module, thus eliminating requirement for Internet Access and connectivity, thus also decreasing th cost.

# The Business Plan

Because we are competing in a space with healthcare apps we need to be on our toes and present unique features to attract a potential customer. This also increases the customer acquisition cost.

## Competition

The major competitions are fitness apps which promise the user fitness wiihout needing to get out of the house. We also are endangered by flexible gym memberships which allows our user to improve their health without interacting with the outside world.

Our project tries to create a new idea of regularly cleaning our surrounding without considering it as a special act, which means to encorporate it into our daily routine. We are trying to innovate a new normality in the fact that people can help their environment with just a walk!

## Business Model

We plan to partner with local government to get initial grants to deploy our dustbins and create a network of contractor keeping the dustbins healthy. 

Then once we have a network ready. We can start partnerships with local shops and brands promoting local economy which the user can experience for themselves while on one of our walks. We can also promote local heritage and show the user what their community looks like, this is especially applicable for youngsters who are involved in their devices more than their surroundings.

We can partner with medium-sized shops or malls who can sponsor a dustbin which would mean the dustbin's health is managed by them, while we tweak the route of the user to promote the shop on their route.

## Costs

Ignoring the software costs. We obviously rely on Microsoft Azure services and it's monthy costs. 
We also need to include the hardware costs. Currently it cost's us about 1500 Rs to source off-the self parts and construct our module. After our initial implementation the cost can be reduced by using a PCB and mass production of our hardware modules.


## Additional Information

- Open Source: We keep to aim our project Open Source and make sure the user knows what information are we tracking.
- Community Leaderboard: Once our app has a big enough userbase, we can create communities and allow them to compete for the most cleanest areas. Our country already has yearly competitions between our cities, and we take inspiration from those.

> Fun Fact: Bhopal our University's host city is rated the 2nd cleanest city in India. The cleanest city Indore, is a twin city accompanying Bhopal.





# Installation Instructions


# Welcome!
This is the installation instructions for our app Sudarshan. This is a official Microsoft Imagine Cup submission.

> This document only contains the app and the server implementation.
> The hardware implementation is currently not ready due to shipping constraints and faulty delivery.

# Prerequisites

You need to have `Node` installed. This is the JavaScript runtime currenly being used on our project. 

You also need `yarn` installed. If needed this can be installed using the command below

```sh
npm instal -g yarn
```

After installing both of them. Confirm that they are on the PATH variable. To confirm their versions and usability. You can print their version info. A screenshot is attached to show the desired result.

```sh
npm --version
```

```sh
yarn --version
```


![[Pasted image 20221231204525.png]]

To build the APK, you will need the Android SDK and a emulator if not using a real device. For more information refer to the official React Native documentation regarding setting up your development environment. 

## Project Installation

We assume you have either cloned the project from the GitHub repo or unzipped the code.

### Backend

For configuring the backend, you will need the .env file. There exists a `mock.env` file with the project. You will need to initialize the correct variables and rename the file to `.env`  for the backend to work.
The variables needed are

- `AZURE_EMAIL_CONNECTION_STRING`
- `AZURE_EMAIL_SENDER`
- `GOOGLE_CLOUD_MAPS_API_KEY`

We use Google Maps to configure location tracking and route selection. For that create a Google Cloud account setup. 

> For the backend to function. You will need to enable `Directions API` and `Places Autocomplete API` within Google Cloud Maps API.


These variables must be initialized for the backend to work properly. But our frontend automatically connects to `our API hosted on our servers`. You can skip the `.env` file if you only want to check if the server runs.

For starting the backend API, run the following commands in the `server` directory.

```sh
yarn install
```

```sh
yarn start
```


This would start the backend on port `3000`.

An screenshot is attached to show the desired output.

![[Pasted image 20221231204401.png]]

### Frontend

For building the frontend, the app. Open a terminal in to the `client` folder and run the following commands.


```sh
yarn install
```

```sh
yarn android
```

```sh
yarn start
```



> Currently the app directly contacts our API hosted on our servers. If you have started our backend in the background, you may change the variables to point to your locally hosted server. Steps to do that are given below.


#### Configure app to use local backend.

To do the same. Edit the file `src/config/index.js`. There replace the current URL (which will be something like `http://dev.kshitizagrawal.in/api`) with `http://localhost:3000/api`.
 

## Mock Dustbins

This is a sample app to emulate how a dustbin's qr may be generated, without using any real hardware or working with C and it's complexitites.

To do the same move to the `mock-dustbins` and run the following commands.

```sh
yarn install
yarn build
yarn start
```

To skip and use our instance of this mock dustbin visit [here](http://dev.kshitizagrawal.in:4001)

# Conclusion

We hope you are able to run the app and exprience the ecosystem we are trying to develop.

Wish you a very happy new year and good luck for the next one.
