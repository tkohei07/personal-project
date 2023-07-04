# StudySpot: Discover and Share the Best Study Locations
StudySpot is a unique web application crafted to assist students and self-learners in finding the ideal place for study. Be it the serene ambiance of a library or the vivacious energy of a café, our database of study locations, enriched by contributions from our users, makes it convenient for you to uncover new and effective study spots.

As a registered user, your contributions to the community are invaluable. Add new locations, specify their operating hours, and bookmark your favorite spots. You can also craft and share reviews, assisting others in finding the ideal spot.

For those without an account, you can still delve into the extensive information our community has to offer. Peruse various locations, their hours of operation, and read reviews to decide on your next study retreat.

## Tech Stack
StudySpot boasts a blend of various technologies:

- React (SPA): The user interface is a Single Page Application (SPA) crafted using React, offering dynamic updates and reduced page reloads for a seamless user experience.
- Jest: Employed as the testing framework for React.
- Go & Gin: Go, coupled with the Gin HTTP web framework, forms the backbone of the server-side logic.
- JWT (JSON Web Tokens): Implemented for secure authentication and information exchange.
- PostgreSQL: Chosen for robust and reliable data storage.
- Docker & Docker-compose: Ensures consistent application behavior across various environments.
- AWS (Amazon Web Services): Provides a scalable and reliable platform for hosting the application and associated services.
- ECS Fargate & ECR: Used to run, manage, and store Docker containers.
- RDS: Powers our cloud-based PostgreSQL database.
- Terraform: Streamlines the provisioning process of our cloud infrastructure.
- GitHub Actions & CI/CD: Automates the development workflows, including testing and deployment.

## Getting Started
To have a local copy up and running, adhere to the following steps:

### Prerequisites
- Install Docker and Docker-compose.

### Installation
1. Clone the repository:

`git clone https://github.com/tkohei07/personal-project.git `

2. Navigate to the project directory:

`cd personal-project` 

3. Install the required npm packages:

`npm install` 

4. To initiate the application locally with Docker, execute:

`docker-compose up` 

This will spawn Docker containers for your application and start them.

## Testing
Run Frontend Test:

`docker-compose run --rm -e CI=true client sh -c "npm test -- --coverage --watchAll=false"`

Run Backend Test:

`docker-compose run --rm server go test ./cmd/api/...`

`docker-compose run --rm server go test ./internal/repository/dbrepo/...`

On successful test execution, the workflow will display "Tests passed". If any test fails, it will report "Tests failed" and exit with a non-zero status.

## Deployment
The application is hosted on AWS, using a blend of ECS Fargate for running Docker containers, ECR for storing Docker images, and RDS for the PostgreSQL database. Infrastructure management and provisioning is accomplished via Terraform.

## License
This project is released under the Unlicense, which means it's open-source. You have the freedom to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the final products.

## Author
Kohei Tagai

[GitHub Pages](https://github.com/tkohei07)

For queries, suggestions, or contributions to the project, feel free to reach out.

Email: tagai@wisc.edu
