using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Text;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Presentation;
using SoftServe.ITA.PrompterPro.Common;
using SoftServe.ITA.PrompterPro.Domain.Models;
using Drawing = DocumentFormat.OpenXml.Drawing;

namespace SoftServe.ITA.PrompterPro.WebApplication.WebHelper.Parser.Impl
{
	public class PresentationParser : IPresentationParser
	{
	    public Script Parse(Stream stream)
		{
            stream.CheckForNull("stream");

	        Options options = new Options();

			Script script = new Script
			{
                Sections = new List<Section>(),
                Options = options,
				EntityState = EntityState.Added
			};

			using (PresentationDocument document
				= PresentationDocument.Open(stream, false))
			{
			    int order = 0;
				for (int i = 0; i < SlidesCount(document); i++)
				{
					string notes = GetSlideNotes(document, i);

				    if (!string.IsNullOrWhiteSpace(notes))
                    {
                        script.Sections.Add(
                            new Section
                            {
                                Text = notes,
                                Order = order,
                                SectionId = order,
                                EntityState = EntityState.Added
                            });

                        ++order;
                    }
				}
			}
			return script;
		}

		private static int SlidesCount(PresentationDocument document)
		{
			document.CheckForNull("presentation");

			int slidesCount = 0;

			PresentationPart presentationPart
				= document.PresentationPart;

			if (presentationPart != null)
			{
				slidesCount = presentationPart.SlideParts.Count();
			}

			return slidesCount;
		}

		private static string GetSlideNotes(PresentationDocument document, int index)
		{
			var part = document.PresentationPart;
			
			var slideIds = part.Presentation.SlideIdList.ChildElements;

			string notes = null;

			SlideId slideId = slideIds[index] as SlideId;
			if (slideId != null)
			{
				string relId = slideId.RelationshipId;

				SlidePart slide = (SlidePart)part.GetPartById(relId);
				StringBuilder paragraphText = new StringBuilder();

			    var notesPart = slide.NotesSlidePart;

                if (slide.NotesSlidePart != null)
                {
                    var notesSlide = notesPart.NotesSlide;

                    if (notesSlide != null)
                    {
                        var texts = notesSlide.Descendants<Drawing.Text>();

                        foreach (var text in texts)
                        {
                            paragraphText.Append(text.Text);
                        }
                        notes = paragraphText.ToString();
                    }
                }
			}

			return notes;
		}
	}
}