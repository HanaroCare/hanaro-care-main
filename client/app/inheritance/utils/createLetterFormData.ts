export const createLetterFormData = (data: {
  inheritDetailId: string;
  letterCont: string;
  letterTypeCd: 'WRITING' | 'VOICE';
  audioBlob: Blob | null;
}) => {
  const formData = new FormData();

  formData.append('inheritDetailId', data.inheritDetailId);
  formData.append('letterTypeCd', data.letterTypeCd);
  formData.append('letterCont', data.letterCont);

  if (data.audioBlob) {
    const file = new File([data.audioBlob], 'voice.mp3', {
      type: 'audio/mpeg',
    });
    formData.append('voice', file);
  }

  return formData;
};
