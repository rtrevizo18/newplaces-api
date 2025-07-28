# YourPlaces (Frontend) - MERN Stack Places Sharing App

A full-stack web application built with the MERN stack that allows users to share their favorite places with images and interactive maps. Users can create accounts, upload photos, and share locations with detailed descriptions and map integration.

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Place Management**: Create, read, update, and delete places
- **Image Upload**: Upload and store images using AWS S3
- **Interactive Maps**: Google Maps integration for location visualization
- **Responsive Design**: Mobile-friendly interface
- **Real-time Validation**: Form validation with custom validators
- **Protected Routes**: Authentication-based route protection

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **AWS S3** - Image storage
- **Google Geocoding API** - Address-to-Coordinates support

### Frontend [https://github.com/rtrevizo18/newplaces-frontend]

- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **React Transition Group** - Smooth animations
- **Google Maps API** - Interactive maps
- **CSS3** - Styling

### Services

- **Firebase** - Frontend Production deployment
- **Heroku** - Backend Production deployment

### Authentication System

- JWT-based authentication with automatic token refresh
- Persistent login state using localStorage
- Protected routes based on authentication status

### Place Management

- **Create Places**: Add new places with title, description, address, and image
- **View Places**: Browse all places by user
- **Update Places**: Edit existing places (owner only)
- **Delete Places**: Remove places with confirmation (owner only)

### Image Handling

- Client-side image preview before upload
- AWS S3 integration for secure cloud storage
- Automatic image optimization and serving

### Map Integration

- Address-to-coordinates conversion using Google Geocoding API
- Interactive map display for each place
- Responsive map containers

### Form Validation

- Custom validation system with multiple validators:
  - Required fields
  - Email format validation
  - Minimum/maximum length validation
  - File type validation

## 📱 Responsive Design

The application is fully responsive with breakpoints at:

- Mobile: < 768px
- Tablet/Desktop: ≥ 768px

## 🎨 UI/UX Features

- **Loading States**: Spinner components during API calls
- **Error Handling**: User-friendly error modals
- **Smooth Transitions**: CSS transitions for better UX
- **Backdrop Overlays**: Modal and drawer overlays
- **Form Feedback**: Real-time validation feedback

## 🔗 API Integration

The frontend integrates with:

- Custom backend API for user and place management
- Google Maps API for map support
- AWS S3 for static image retrieval

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is part of a MERN stack tutorial and is for educational purposes.

## 🙏 Acknowledgments

- Google Maps API for mapping functionality
- AWS S3 for reliable image storage
- React community for excellent documentation
