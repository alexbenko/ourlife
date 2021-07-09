# Ourlife
[![LinkedIn][linkedin-shield]][linkedin-url]


# PROJECT IS WIP
<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Ourlife</h3>

### Built With
* [Nodejs](https://nodejs.org)
* [Typescript](https://www.typescriptlang.org/docs/)
* [Express](https://expressjs.com/)
* [Redis](https://github.com/NodeRedis/node-redis)
* [Postgres](https://www.postgresql.org/docs/13/index.html)
* [Docker](https://docs.docker.com/)
* [Nginx](http://nginx.org/en/docs/)

<!-- ABOUT THE PROJECT -->
## About The Project
This is the backend microservice for my photo/video sharing platform, Ourlife. 
<a target="_blank" rel="noopener noreferrer" href="https://github.com/alexbenko/ourlife-fe">Click me to see the repository for the front end code.</a> 
</br>
PLEASE keep in mind this project is still in the early stages.

My partner and I go on a lot of trips and do a lot of fun things. We like taking pictures of everything we do, and as a result both of our phones are almost out of storage. I wanted to create a website where we could upload our photos to, so we no longer had to store them on our phone and have a way for our family and friends to see what we are up to. 

Backend/DevOps is the software field I want to get into so I created this project to demonstrate my profeciency. Anyone could upload their photos to a CDN or S3 and serve their content from there. I put in the time and effort in essentially creating my own CDN. 


<!-- MAIN FEATURES -->
## Main Features
<ol>
  <li>
    A docker compose file that quickly spins up the production environment. Where every technology listed above is spun up in its own container.. Some Main Features of that:
    <ul>
      <li>Automatic HTTPS set up. With an auto renewal script that checks every 12 hours if the servers certs are valid and renews them if not.</li>
      <li>An NGINX HTTPS reverse proxy so I dont have to worry about setting up HTTPS for my Nodejs server. The nginx container also has a script that will reload the NGINX config file and HTTPS certs every 6 hours. </li>
      <li>Containers start in proper order, ie the server will be started after the database is set up and nginx is only started after the server starts.</li>
    </ul>
  </li>
  <li>Custom production logging that saves anything logged to its own file.</li>
  <li>Cronjob that uploads all my log files to S3 and then deletes them</li>
  <li>Cronjob that exports a backup of the Postgres database, uploads it to S3, and then deletes the backup file.</li>
  <li>Honey pot endpoints that keep track of the ip of the request, stores it, and then 404s. Currently storing in redis</li>
  <li>Custom Middleware that checks the ip of every request, if the ip is in the data store, 404s</li>
</ol>

<!-- LICENSE -->
## License

Distributed under the GNU General Public License v3.0 License. See `LICENSE` for more information.

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [README Template](https://github.com/othneildrew/Best-README-Template/blob/master/README.md)
* [Img Shields](https://shields.io)
* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Pages](https://pages.github.com)

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/alexander-benko-06b99a1a4/
[product-screenshot]: images/screenshot.png
