/**
 * 현재 대표 사진이 없는 매장:
 * - 중국관: 17870463
 * - 꿈꾸는떡볶이: 36314561
 * - 다람이임자탕: 31549365
 * - 강북민물장어: 35425415
 *
 * 대표 사진 수정이 필요한 매장:
 * - 도로시화덕피자: 1607577852
 * - 하늘지기: 18205789
 * - 호또: 1277476249
 * - 스마일 닭갈비: 1701488248
 * - 참맛집: 2009103325
 * - 세상만사: 1743715551
 * - 최고집해물찜칼국수: 32723428
 * - 담터추어탕: 1608592628
 * - 담터쭈꾸미: 1659973930
 * - 스테이564: 1257242237
 * - 뚱보칡냉면: 37769599
 * - 원조태릉갈비: 17870506
 */
export const PLACE_IMAGE_OVERRIDES: Record<string, string> = {
  '17870463':
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNjAzMTJfMTEg%2FMDAxNzczMzI0NzA1OTI3.1c7X-_LlCYHmur9wreL2qxc5H7eXEFt3WZ2YRKZUt-Ag.BKUwYJcH5nkb_ggHgkJCGSgM4wC_JIg5oQfDWI55yo4g.JPEG%2FAF90968C-B3D8-4F92-8758-3C47A74845D1.jpeg',
  '36314561':
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNjAzMTZfODYg%2FMDAxNzczNjE5NjE2MzA0.KgWXApdwwA5hF0PjIgiLGW1YbKUbekrvGFeeePO0jaYg.DcLunhbVRyhlSXbM0zqgFRo6mP42XFQA-XH5ZJtYXysg.JPEG%2FIMG%EF%BC%BF6268.JPG%2F900x1200',
  '31549365':
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTEwMTZfMTE2%2FMDAxNzYwNTg5Mzg2NjI3.TG8jMJb-xgiH1YqbknjO9Blw2Lcf7e_T5BeYHG29hlog.PJO-9rZLunXXPa9D_UOGPeV_K4BZtWhHFO5FheAHhREg.JPEG%2F94C45EB8-3EDD-4E07-B137-D6148C76881A.jpeg',
  '35425415':
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNjA4MDFfMzIg%2FMDAxNzg1NTg1NzQwODcy.vn0qMko6lYy8XCrTzlGx_58RMFBXfCJrU61ANYGAPf4g.BCFxaFACR8Fya2ch2QgzNuTVxpFDas5IcjRCdvJKelcg.JPEG%2FE6634DE0-65DF-447A-BD04-6708BE81FF32.jpeg',
  '1607577852':
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fblogfiles.pstatic.net%2FMjAyNTA3MThfMjMg%2FMDAxNzUyODM4MDgxMjU2.KhXBiB-vZvqz5PPRQhaNwLQkTnhRPIQS8cS3PcRx7hog.EDmH2nmNPVnDWEonmw0il-JcEfQWLedVfV--ztUdZCAg.JPEG%2FIMG%EF%BC%BF9237.jpg%2F900x1200',
  '18205789':
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTA3MTFfMjk5%2FMDAxNzUyMjIwNTAyNzAx.r3NJT65Zvevn1BAQIDeJuTiSd1YMLqsOTR-n1ODVEPog.pu3ewAwKWtkNAeAGm9HqaimkuEK-pZgFGUKPB063macg.JPEG%2F4C03001F-593A-49BB-8AFF-8AFC647670B1.jpeg',
  '1277476249':
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20260129_272%2F17696832112001Fjyl_JPEG%2F%25C8%25A3%25B6%25C7_%25C7%25D1%25BB%25F32-%25C0%25CE%25BC%25E2%25BF%25EB-sharpen-upscale-2.5x.jpg',
  '1701488248':
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230311_92%2F16785045852911aYpI_JPEG%2Fimage.jpg',
  '2009103325':
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNjAxMjBfMjMg%2FMDAxNzY4ODc5ODMzODM2.8vYVNhFY25HVZwc22ITfWUTX_OuSTHdM380V4IFQpZsg.whQW_QJaR5Rf8TYw_svcaOCNILjYre-i9MkFKVe_Rnsg.JPEG%2F1000040802.jpg.jpg',
  '1743715551':
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTExMDdfODIg%2FMDAxNzYyNTA3MDgzODA2.1LNDUOnF1SPZ8hgaPk-vt5AbNB-F0S0VDb_nzqU5PkUg.PDmBdx_i0DMB55Kt4pNAYloijreBwo17sl8-80CYTYog.JPEG%2FEA9B558A-897B-430A-AE4E-B50C3BBD8242.jpeg',
  '32723428':
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTEyMTZfNzgg%2FMDAxNzY1ODgwNzA3Nzc3.nQ8lG9pUU6oYA8zzpUYF69DZ19HqcQd2en9jChGf1Jkg.A-1-hm9FJbRhjcV87eDSApk7aR1sOdag7wd-ximm89Ag.JPEG%2F20251216_173800.jpg.jpg',
  '1608592628':
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNjA4MDVfMjIx%2FMDAxNzg1OTAzMTY1NjMz.OVdJ1zDnOV15YLnFLB-ohy86ibSjlwmATCR8CXV9GN4g.n8Soj-DEGAj87Yc2wWTZIB4NEA-3mMPmNoM-xUK_f2gg.JPEG%2F20260805_124006.jpg.jpg',
  '1659973930':
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNjA1MTRfMTcg%2FMDAxNzc4NzQzNjI1ODU4.gNdqLpJIoc2BNj8o-P0hVE_KS1QXnx_JCrv_4BVxuYog.f-EwBZcoHfgcG2bp07D-NvodMcvt9zN7Rg86tOq7xSog.JPEG%2F20260514_111124.jpg.jpg',
  '1257242237':
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240703_94%2F1719945759914UG9Qu_JPEG%2F1000005959.jpg',
  '37769599':
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTA4MThfMjYy%2FMDAxNzU1NDkxNDEzMTg4.cDn7ciorjksc9kDsuyWsvdrZ08rU9Sgxp-5LuRrnPeAg.pZr4hz2nGvZmZEc5mQfEqsm2a0z8j66I_4iKaL817SIg.JPEG%2F20250803_110521.jpg.jpg',
}
