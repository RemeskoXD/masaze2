import fs from 'fs';
let content = fs.readFileSync('components/AdminPanel.tsx', 'utf-8');

const pattern = `                      )}
                    </>
                  ) : (`;

const replacement = `                      )}
                  </div>
                    </>
                  ) : (`;

content = content.replace(pattern, replacement);

fs.writeFileSync('components/AdminPanel.tsx', content);
