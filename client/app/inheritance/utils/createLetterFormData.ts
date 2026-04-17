export const createLetterFormData = (data: {
  inheritDetailId: string;
  letterCont: string;
  letterTypeCd: 'WRITING' | 'VOICE';
  audioBlob: Blob | null;
}) => {
  const formData = new FormData();

  // 1. DTO 필드명 매칭
  formData.append('inheritDetailId', data.inheritDetailId);
  formData.append('letterTypeCd', data.letterTypeCd);
  formData.append('letterCont', data.letterCont);

  // 2. 파일 추가
  if (data.audioBlob) {
    const file = new File([data.audioBlob], 'voice.mp3', {
      type: 'audio/mpeg',
    });
    formData.append('voice', file);
  }

  return formData;
};
