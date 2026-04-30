// const { google } = require('googleapis');
// const fs = require('fs');
// const path = require('path');

// class GoogleDriveService {
//   constructor() {
//     this.drive = null;
//     this.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
//     this.oauth2Client = null;
//   }

//   async getDrive() {
//     if (!this.drive) {
//       try {
//         // Use OAuth2 with the downloaded credentials
//         const credentials = JSON.parse(fs.readFileSync('oauth2.json'));
        
//         const { client_id, client_secret } = credentials.installed || credentials.web;
        
//         this.oauth2Client = new google.auth.OAuth2(
//           client_id,
//           client_secret,
//           'http://localhost' // For desktop app
//         );
        
//         // Check if we have a saved token
//         const tokenPath = path.join(process.env.HOME, '.drive-token.json');
//         if (fs.existsSync(tokenPath)) {
//           const token = JSON.parse(fs.readFileSync(tokenPath));
//           this.oauth2Client.setCredentials(token);
//           console.log('✅ Using saved Drive token');
//         } else {
//           // Generate auth URL for first-time setup
//           const authUrl = this.oauth2Client.generateAuthUrl({
//             access_type: 'offline',
//             scope: ['https://www.googleapis.com/auth/drive.file'],
//             prompt: 'consent'
//           });
          
//           console.log('\n🔐 First-time setup required!');
//           console.log('1. Open this URL in your browser:');
//           console.log(authUrl);
//           console.log('\n2. Authorize the application');
//           console.log('3. Enter the authorization code here:\n');
          
//           // You'll need to run this in an interactive mode
//           // For now, we'll throw an error with instructions
//           throw new Error(`First-time setup required. Please visit:\n${authUrl}`);
//         }
        
//         this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
//         console.log('✅ Google Drive authenticated');
//       } catch (error) {
//         console.error('❌ Authentication error:', error.message);
//         throw error;
//       }
//     }
//     return this.drive;
//   }

//   async setToken(authCode) {
//     const { tokens } = await this.oauth2Client.getToken(authCode);
//     this.oauth2Client.setCredentials(tokens);
    
//     // Save token for future use
//     const tokenPath = path.join(process.env.HOME, '.drive-token.json');
//     fs.writeFileSync(tokenPath, JSON.stringify(tokens));
//     console.log('✅ Token saved successfully');
//   }

//   async uploadFile(file, metadata = {}) {
//     try {
//       const drive = await this.getDrive();
      
//       if (!this.folderId) {
//         throw new Error('GOOGLE_DRIVE_FOLDER_ID is not set in environment variables');
//       }
      
//       const fileMetadata = {
//         name: `${Date.now()}_${file.originalname}`,
//         parents: [this.folderId],
//         ...metadata
//       };

//       const media = {
//         mimeType: file.mimetype,
//         body: fs.createReadStream(file.path),
//       };

//       console.log(`📤 Uploading: ${file.originalname}`);

//       const response = await drive.files.create({
//         resource: fileMetadata,
//         media: media,
//         fields: 'id, name, webViewLink, size, mimeType',
//       });

//       // Make file publicly accessible
//       await drive.permissions.create({
//         fileId: response.data.id,
//         requestBody: {
//           role: 'reader',
//           type: 'anyone',
//         },
//       });

//       const fileUrl = `https://drive.google.com/uc?export=view&id=${response.data.id}`;
      
//       // Clean up temp file
//       try {
//         await fs.promises.unlink(file.path);
//       } catch (err) {
//         console.error('Error deleting temp file:', err);
//       }
      
//       console.log(`✅ Uploaded: ${response.data.name}`);
      
//       return {
//         id: response.data.id,
//         filename: response.data.name,
//         url: fileUrl,
//         originalName: file.originalname,
//         size: file.size,
//         mimeType: file.mimetype,
//         webViewLink: response.data.webViewLink
//       };
//     } catch (error) {
//       try {
//         if (file.path && fs.existsSync(file.path)) {
//           await fs.promises.unlink(file.path);
//         }
//       } catch (err) {}
      
//       console.error('❌ Upload error:', error.message);
//       throw error;
//     }
//   }

//   async deleteFile(fileId) {
//     try {
//       const drive = await this.getDrive();
//       await drive.files.delete({ fileId });
//       console.log(`✅ Deleted: ${fileId}`);
//       return true;
//     } catch (error) {
//       console.error('❌ Delete error:', error.message);
//       throw error;
//     }
//   }
// }

// module.exports = new GoogleDriveService();
const { google } = require('googleapis');
const fs = require('fs');

class GoogleDriveService {
    constructor() {
        this.drive = null;
        this.folderId = '1tqLs1f73zhCk8zuu_DELUcL0RglBS5-l'; // Your folder ID
    }

    async getDrive() {
        if (!this.drive) {
            // This automatically uses your gcloud credentials
            const auth = new google.auth.GoogleAuth({
                scopes: ['https://www.googleapis.com/auth/drive.file']
            });
            const authClient = await auth.getClient();
            this.drive = google.drive({ version: 'v3', auth: authClient });
        }
        return this.drive;
    }

    async uploadFile(file) {
        try {
            const drive = await this.getDrive();
            
            const fileMetadata = {
                name: `${Date.now()}_${file.originalname}`,
                parents: [this.folderId]
            };

            const media = {
                mimeType: file.mimetype,
                body: fs.createReadStream(file.path)
            };

            console.log(`📤 Uploading: ${file.originalname}`);
            
            const response = await drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id, name, webViewLink'
            });

            // Make file publicly accessible
            await drive.permissions.create({
                fileId: response.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            });

            // Clean up temp file
            fs.unlinkSync(file.path);

            const fileUrl = `https://drive.google.com/uc?export=view&id=${response.data.id}`;
            
            console.log(`✅ Uploaded: ${response.data.name}`);
            
            return {
                id: response.data.id,
                name: response.data.name,
                url: fileUrl,
                webViewLink: response.data.webViewLink
            };
        } catch (error) {
            console.error('Upload error:', error.message);
            throw error;
        }
    }

    async listFiles() {
        const drive = await this.getDrive();
        const response = await drive.files.list({
            pageSize: 10,
            fields: 'files(id, name, mimeType)'
        });
        return response.data.files;
    }
}

module.exports = new GoogleDriveService();