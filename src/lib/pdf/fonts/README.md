# Embedded document fonts

`NotoSans-Regular.ttf` and `NotoSans-Bold.ttf`, from the Noto project
(<https://github.com/notofonts/notofonts.github.io>), under the SIL Open Font License 1.1
recorded in `OFL.txt`. The OFL permits embedding in documents without restriction.

They are here because trade documents carry party names the base-14 PDF fonts cannot
represent. Noto Sans covers Latin (including Central European, Turkish and Vietnamese),
Greek and Cyrillic. Chinese, Japanese, Korean and Arabic are **not** covered; text in those
scripts still degrades to the replacement character, and adding them means adding the
corresponding Noto font.

Only the glyphs a document actually uses are embedded in its PDF, so output stays small
regardless of the size of these source files.
