// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import CreateDocsForm, { CreateDocsFormData } from './CreateDocsForm';

// interface CreateDocsDialogDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
//   // eslint-disable-next-line no-unused-vars
//   onSubmit: (data: CreateDocsFormData) => void;
//   isLoading: boolean;
// }

// const CreateDocsDialog: React.FC<CreateDocsDialogDialogProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   isLoading,
// }) => {
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className='max-h-[90vh] max-w-[95vw] overflow-y-auto md:max-w-[90%]'>
//         <DialogHeader>
//           <DialogTitle className='text-lg font-medium text-gray-900'>
//             Create New Docs
//           </DialogTitle>
//           <DialogDescription className='text-sm text-gray-600'>
//             Add a new documentation to organize your content.
//           </DialogDescription>
//         </DialogHeader>

//         <div className='mt-4'>
//           <CreateDocsForm
//             onSubmit={onSubmit}
//             onCancel={onClose}
//             isLoading={isLoading}
//             submitText='Create Docs'
//           />
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreateDocsDialog;
