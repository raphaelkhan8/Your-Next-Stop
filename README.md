# YourNextStop
The travel app to end all travel apps! Your Next Stop will allow users to create unique routes + customize their trip spontaneously. Whether you want to plan your trip on our desktop app or take it with our mobile version, this app is meant to be used as much as you want it and no more. 

http://www.yournextstop.fun/

<img align="left" title="Filter places by category to find local interests catered towards you." src="https://rkportfolio-stuff.s3.amazonaws.com/Your+Next+Stop/explore+page.JPG" height="370" width="285"><img align="center" title="See details about places that intrigue you." src="https://rkportfolio-stuff.s3.amazonaws.com/Your+Next+Stop/details+page.JPG" height="370" width="285"><img align="right" title="Plan a road trip and see interesing places along the way." src="https://rkportfolio-stuff.s3.amazonaws.com/Your+Next+Stop/route+page.JPG" height="370" width="260">

## Getting Started
These instructions will allow you to get a copy of this project running on your local machine.

### Prerequisites
Before starting, ensure you have met the following requirements:

You have installed the latest version of npm and node. If not, follow the instructions from this link:
`https://www.npmjs.com/get-npm`
You have installed PostgreSQL on your local machine. If not, you can install it golbally by running the following command:
`npm install -g pg`

Fork this repository as well as the Back-End repo and clone them to your local machine.

your-next-stop is the client-side repo while Back-End is the server-side one. Inside each of these run the followwing to install dependencies:
`npm install`

Cd into the your-next-stop directory and run the following command to run the client:
`npm start`

## Development server
In order to start the server, you will need PostgreSQL installed on your machine and a .env file with appropriate variables:

+ DATABASE = 'yournextstop'
+ USER_NAME = whatever username you use to access PostgreSQL
+ USER_PASSWORD = whatever passport you use to access PostgreSQL
+ HOST = 'localhost'
+ PORT = 5432
+ GOOGLE_MAPS_API_KEY= API key you recieve from Google Maps API Platform. (You can get one here: https://developers.google.com/maps/documentation/directions/get-api-key)
+ FRONTEND_BASE_URL=http://localhost:4200 (This is used to connect to your client. Can be changed to client-repo deployed URL for production.)

Run `ng serve` to start the dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Built With

* [Angular 8 + Angular CLI](https://angular.io/cli) - The web framework used
* [Ignite UI for Angular](https://www.infragistics.com/products/ignite-ui-angular) - Front end design
* [Node.js](https://nodejs.org/en/docs/) - Server-side runtime environment
* [Express](https://expressjs.com/en/api.html) - Server-side framework 
* [PostgreSQL](https://expressjs.com/en/api.html) - RDBMS
* [Passport.js](http://www.passportjs.org/packages/passport-google-oauth2/) - Authentication using Google Sign-In Strategy

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

<!-- ## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). -->

## Authors

* **Raphael Khan** - *Scrum Master/Back-End*
* **Samantha De La Fuente** - *Back-End*
* **Gary Marino Jr.** - *Front-End*
* **David Polk** - *Front-End*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* The friendly staff at Operation Spark

