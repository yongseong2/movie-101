const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export function useProfile(username: string) {
  const api = useApi()
  return useAsyncData(`profile:${username}`, () => api.profile.getProfile(username))
}

/** 프로필 이미지 업로드 (형식 · 용량 검증 포함) */
export function useProfileImageUpload(username: string, onChange: () => Promise<unknown>) {
  const api = useApi()
  const toast = useToast()

  return useAsyncAction(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드할 수 있어요.')
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('5MB 이하의 이미지를 선택해주세요.')
      return
    }
    await api.profile.updateProfileImage(username, file)
    await onChange()
    toast.success('프로필 사진을 변경했어요.')
  }, { errorMessage: '프로필 사진을 변경하지 못했습니다.' })
}
